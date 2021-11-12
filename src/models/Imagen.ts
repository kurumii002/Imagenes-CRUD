import { Document, Schema, model } from "mongoose";

export interface IImagen extends Document {
	nombre: string;
	tipo: string;
	url: string;
}

const ImagenSchema = new Schema<IImagen>({
	nombre: {
		type: String,
		required: true,
	},
	tipo: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	}
});

export const Imagen = model<IImagen>("Imagen", ImagenSchema);