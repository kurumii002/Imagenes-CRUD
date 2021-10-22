import mongoose from "mongoose";
import { config } from "dotenv";
config();

/**
 * Función para hacer la conexión a la base de datos MongoDB
 */
export async function connectDatabase() {
	try {
		await mongoose.connect(process.env.MONGODB_URL!);
		console.log(">>MONGODB CONECTADO");

	} catch(error) {
		console.log(`>>ERROR AL CONECTAR A MONGODB: ${error}`);
	}
}