//encargado de ejecutar la aplicacion
import { Application } from "./app";
import { connectDatabase } from "./database";
import { connectCloudinary } from "./cloudinary";

//iniciando el servidor
try {
	connectDatabase();
	connectCloudinary();

	new Application().start();

} catch (error) {
	console.log(error);
	process.exit(1);
}