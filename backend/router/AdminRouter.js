import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllAlerts,
  getDashboardStats,
} from "../controller/AdminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const AdminRouter = express.Router();

/* ================= ADMIN DASHBOARD ================= */

AdminRouter.get(
  "/dashboard",
  authMiddleware,       //get /api/admin/dashboard
  adminMiddleware,
  getDashboardStats
);

/* ================= USERS ================= */

AdminRouter.get(
  "/users",
  authMiddleware,           //get /api/admin/users
  adminMiddleware,
  getAllUsers
);

AdminRouter.delete(
  "/user/:id",
  authMiddleware,           //get /api/admin/user/:id
  adminMiddleware,
  deleteUser
);

/* ================= ALERTS ================= */

AdminRouter.get(
  "/alerts",
  authMiddleware,
  adminMiddleware,      //get /api/admin/alerts
  getAllAlerts
);

export default AdminRouter;