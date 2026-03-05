import express from "express";
import {
  sendAlert,
  getUserAlerts,
  getAllAlerts,
  updateAlertStatus,
} from "../controller/AlertController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadVideo.js";

const AlertRouter = express.Router();

/* ================= SEND EMERGENCY ALERT ================= */

AlertRouter.post(
  "/send-alert",
  authMiddleware,
  upload.single("video"),  //post /api/alerts/send-alert
  sendAlert
);

/* ================= USER ALERT HISTORY ================= */

AlertRouter.get("/my-alerts", authMiddleware, getUserAlerts);  //post /api/alerts/my-alerts

/* ================= ADMIN VIEW ALL ALERTS ================= */

AlertRouter.get("/all", authMiddleware, getAllAlerts);  //post /api/alerts/all

/* ================= UPDATE ALERT STATUS ================= */

AlertRouter.put("/resolve/:id", authMiddleware, updateAlertStatus);  //post /api/alerts/resolve/:id

export default AlertRouter;