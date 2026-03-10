import express from "express";
import { getAlertsChart, getDashboardStats } from "../controller/AlertController.js";
import { deleteUser, getAllUsers } from "../controller/AdminController.js";

const AdminRouter = express.Router();

AdminRouter.get("/dashboard", getDashboardStats);
AdminRouter.get("/alerts-chart", getAlertsChart);
AdminRouter.get("/users",getAllUsers);
AdminRouter.delete("/users/:id",deleteUser);
export default AdminRouter;