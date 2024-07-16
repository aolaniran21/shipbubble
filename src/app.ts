// import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import ticketRoutes from './routes/ticketRoutes';
import sequelize from './config/database';
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
// console.log("Hello World");
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to Shipbubble!!!");
});
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);

// sequelize.sync().then(() => {
//     // console.log('Database connected');
// });

export default app;
