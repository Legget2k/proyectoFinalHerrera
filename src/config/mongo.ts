import mongoose from "mongoose";

process.loadEnvFile();

const URI_DB = process.env.URI_DB || "";

const connectMongoDB = async () => {
    try{
        await mongoose.connect(URI_DB)
        console.log("✔️ Conexion con la base de datos éxitosa");
    }catch (error) {
        console.log("❌ Conexion con la base de datos rechazada");
    }
}

export { connectMongoDB };