import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  addEmergencyContact,
  deleteEmergencyContact,
  sendContactMessage,
  getContacts,
  updateProfile
} from "../controller/UserController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const UserRouter = express.Router();

/* ================= USER AUTH ================= */

// Register User
UserRouter.post("/register", registerUser);

// Login User
UserRouter.post("/login", loginUser);

UserRouter.use("/contact",sendContactMessage);


/* ================= USER PROFILE ================= */

// Get logged in user profile
UserRouter.get("/profile", authMiddleware, getUserProfile);
UserRouter.put("/update-profile", authMiddleware, updateProfile);


/* ================= EMERGENCY CONTACTS ================= */

// Add emergency contact
UserRouter.post("/add-contact", authMiddleware, addEmergencyContact);

UserRouter.get("/contacts", authMiddleware, getContacts);
// Delete emergency contact
UserRouter.delete("/delete-contact/:contactId", authMiddleware, deleteEmergencyContact);



export default UserRouter;