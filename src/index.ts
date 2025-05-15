import express from 'express';
import { connectMongoDB } from './config/mongo';
import { ShoesRouter } from './routes/ShoesRouter';
import { authRouter } from './routes/authRouter';
import { AuthMiddleware } from './middlewares/AuthMiddleware';

process.loadEnvFile();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/Shoes", AuthMiddleware, ShoesRouter);

app.listen(PORT, () => {
    console.log(`✔️ Servidor en escucha en el puerto http://localhost:${PORT}`);
    connectMongoDB();
});