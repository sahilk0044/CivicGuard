import express from "express";
import { getAlertsChart, getDashboardStats } from "../controller/AlertController.js";
import { addAuthority, deleteUser, getAllUsers, Adminlogin, getAdminProfile, updateAdminProfile } from "../controller/AdminController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js";

const AdminRouter = express.Router();

AdminRouter.get("/dashboard", getDashboardStats);
AdminRouter.get("/alerts-chart", getAlertsChart);
AdminRouter.get("/users",getAllUsers);
AdminRouter.get("/admin-profile",adminMiddleware,getAdminProfile);

AdminRouter.put(
  "/admin-profile",
  adminMiddleware,
  upload.single("profileImage"),
  updateAdminProfile
);
AdminRouter.delete("/users/:id",deleteUser);
AdminRouter.post("/add-authority", addAuthority);
AdminRouter.post("/login", Adminlogin);
export default AdminRouter;