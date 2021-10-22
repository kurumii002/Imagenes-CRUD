import cloudinary from "cloudinary";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import multer from "multer";
import { config } from "dotenv";
config();

/**
 * Funcion que hace la conexion al API de Cloudinary
 */
export function connectCloudinary() {
	cloudinary.v2.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
}

/**
 * Funcion que permite subir una imagen a Cloudinary
 * @returns upload
 */
export function uploadToCloudinary() {
	interface cloudinaryOptions extends Options {
		params: {
			folder: string
		}
	}
	const multerOpts: cloudinaryOptions = {
		cloudinary: cloudinary.v2,
		params: {
			folder: "DSN-lab09",
		},
	};

	//se establecen los parametros (opciones)
	const storage = new CloudinaryStorage(multerOpts);

	const upload = multer({ storage: storage });

	return upload;
}

/**
 * Funcion que elimina una imagen de Cloudinary
 * @param public_id 
 */
export async function deleteImage(public_id: string) {
	cloudinary.v2.uploader.destroy(public_id, { resource_type: "image" }, (error, result) => console.log(result, error));
}