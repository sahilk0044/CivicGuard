import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Server } from "socket.io";

import UserRouter from "./router/UserRouter.js";
import AdminRouter from "./router/AdminRouter.js";
import AuthorityRouter from "./router/AuthorityRouter.js";
import AlertRouter1 from "./router/AlertRouter1.js";

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

app.use("/api/users", UserRouter);
app.use("/api/alerts", AlertRouter1);
app.use("/api/admin", AdminRouter);
app.use("/api/authority", AuthorityRouter);

app.use("/uploads", express.static("uploads"));
app.use("/videos", express.static("uploads/videos"));

/* ================= DATABASE ================= */

const PORT = process.env.PORT || 2000;
const URL = process.env.MONGOURL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("DB connected successfully");

    /* IMPORTANT: store server instance */

    const server = app.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });

    /* ================= SOCKET.IO ================= */

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    /* socket connection */

    io.on("connection", (socket) => {
      console.log("Admin connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    /* export io globally */

    app.set("io", io);
  })
  .catch((error) => console.log(error));