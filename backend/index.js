import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import UserRouter from './router/UserRouter.js';
import AlertRouter from './router/AlertRouter.js';
import AdminRouter from './router/AdminRouter.js';
import AuthorityRouter from './router/AuthorityRouter.js';


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



const PORT = process.env.PORT || 2000;
const URL = process.env.MONGOURL;

mongoose.connect(URL)
  .then(() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => {
      console.log("Server is running on Port:", PORT);
    });
  })
  .catch(error => console.log(error));
  app.use("/api/users",UserRouter);
  app.use("/api/alerts",AlertRouter);
  app.use("/uploads", express.static("uploads"));
  app.use("/api/admin",AdminRouter);
  app.use("/api/authority",AuthorityRouter);
