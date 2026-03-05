import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  addEmergencyContact,
  deleteEmergencyContact
} from "../controller/UserController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const UserRouter = express.Router();

/* ================= USER AUTH ================= */

// Register User
UserRouter.post("/register", registerUser);

// Login User
UserRouter.post("/login", loginUser);


/* ================= USER PROFILE ================= */

// Get logged in user profile
UserRouter.get("/profile", authMiddleware, getUserProfile);


/* ================= EMERGENCY CONTACTS ================= */

// Add emergency contact
UserRouter.post("/add-contact", authMiddleware, addEmergencyContact);

// Delete emergency contact
UserRouter.delete("/delete-contact/:contactId", authMiddleware, deleteEmergencyContact);


export default UserRouter;