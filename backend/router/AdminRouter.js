import express from "express";
import { getAlertsChart, getDashboardStats } from "../controller/AlertController.js";

const AdminRouter = express.Router();

AdminRouter.get("/dashboard", getDashboardStats);
AdminRouter.get("/alerts-chart", getAlertsChart);

export default AdminRouter;