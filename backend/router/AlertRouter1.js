import express from "express";
import {
  
  getUserAlerts,
  getAllAlerts,
  updateAlertStatus,
  deleteAlert,
  getReports,
  sendAlert,
} from "../controller/AlertController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadVideo.js";

const AlertRouter1 = express.Router();

/* ================= SEND EMERGENCY ALERT ================= */

AlertRouter1.post(
  "/send-alert",
  authMiddleware,
  upload.single("video"),  //post /api/alerts/send-alert
  sendAlert
);

/* ================= USER ALERT HISTORY ================= */

AlertRouter1.get("/my-alerts", authMiddleware, getUserAlerts);  //get /api/alerts/my-alerts

/* ================= ADMIN VIEW ALL ALERTS ================= */

AlertRouter1.get("/all-alerts",getAllAlerts);  //get /api/alerts/all-alerts

/* ================= UPDATE ALERT STATUS ================= */

AlertRouter1.put("/resolve/:id", authMiddleware, updateAlertStatus);  //put /api/alerts/resolve/:id
AlertRouter1.delete("/delete/:id", deleteAlert);  

AlertRouter1.get("/all-reports", getReports);


export default AlertRouter1;