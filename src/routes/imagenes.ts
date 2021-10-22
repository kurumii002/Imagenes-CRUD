import { Router, Request, Response } from "express";
import { uploadToCloudinary, deleteImage } from "../cloudinary";
import { config } from "dotenv";
config();

const router = Router();
const upload = uploadToCloudinary();

//modelo db
import { Imagen } from "../models/Imagen";

//RUTAS
router.route("/create")
	.get((req: Request, res: Response) => {
		res.render("imagenes/create");
	})
	.post(upload.single("img"), async (req: Request, res: Response) => {
		const extension = (req.file?.path)?.split(".")[3];
		const url = req.file?.path;

		await Imagen.create({ nombre: req.body.nombre, tipo: extension, url: url });

		//cuando se guarda, que redireccione a la lista
		res.redirect("/imagenes/list");
	});

router.route("/list")
	.get(async (req: Request, res: Response) => {
		const imagenes = await Imagen.find().lean();

		res.render("imagenes/list", { imagenes });
	});

router.route("/delete/:id")
	.get(async (req: Request, res: Response) => {
		//busca los datos de la imagen
		const imagen_data = await Imagen.findById(req.params.id).lean();

		if (imagen_data) {
			//se obtiene el public id
			const url_components = (imagen_data.url).split("/");
			const id_img = url_components[8].split(".")[0];
			const public_id = `${url_components[7]}/${id_img}`;

			//se elimina la imagen de cloudinary
			deleteImage(public_id);

			//se eliminan los datos de la BD
			await Imagen.findByIdAndDelete(req.params.id);
		}

		res.redirect("/imagenes/list");
	});

router.route("/edit/:id")
	.get(async (req: Request, res: Response) => {
		const imagen = await Imagen.findById(req.params.id).lean();

		res.render("imagenes/edit", { imagen });
	})
	.post(upload.single("img"), async (req: Request, res: Response) => {
		//se obtiene el id x la url
		const { id } = req.params;

		//busca los datos de la imagen
		const imagen_data = await Imagen.findById(id).lean();

		if (req.file) { //si se sube una imagen
			if (imagen_data) {
				//se obtiene el public id
				const url_components = (imagen_data.url).split("/");
				const id_img = url_components[8].split(".")[0];
				const public_id = `${url_components[7]}/${id_img}`;
	
				//se elimina la imagen antigua de cloudinary
				deleteImage(public_id);
			}
	
			const extension = (req.file.path).split(".")[3];
			const url = req.file.path;

			//actualiza la nueva url de la imagen
			await Imagen.findByIdAndUpdate(id, { nombre: req.body.nombre, tipo: extension, url: url });
		}
	
		//sino solo actualiza el nombre
		await Imagen.findByIdAndUpdate(id, { nombre: req.body.nombre });

		res.redirect("/imagenes/list");
	});

export default router;