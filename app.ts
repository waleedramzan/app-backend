import dotenv from "dotenv";
import express from "express";
import { Application } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import authRouter from './src/routes/auth';
import productRoute from './src/routes/product';
import authenticate from "./src/middlewares/authenticate";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({
  extended: true
}));
dotenv.config();

app.use('/auth', authRouter);
app.use('/product', authenticate, productRoute);

const PORT: number = 3000;
app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
