import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  addEmergencyContact,
  deleteEmergencyContact,
  sendContactMessage,
  getContacts,
  updateProfile,
  sendSupportMessage,
  updateEmergencyContact,
  forgotPassword,
  changePassword
} from "../controller/UserController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
const UserRouter = express.Router();

/* ================= USER AUTH ================= */

// Register User
UserRouter.post("/register", registerUser);

// Login User
UserRouter.post("/login", loginUser);
UserRouter.post("/forgotpassword", forgotPassword);
UserRouter.post("/change-password",authMiddleware,changePassword);

UserRouter.post("/contact",sendContactMessage);
UserRouter.post("/support",sendSupportMessage);


/* ================= USER PROFILE ================= */

// Get logged in user profile
UserRouter.get("/profile", authMiddleware, getUserProfile);
UserRouter.put("/update-profile", authMiddleware,  upload.single("profileImage"),updateProfile);


/* ================= EMERGENCY CONTACTS ================= */

// Add emergency contact
UserRouter.post("/add-contact", authMiddleware, addEmergencyContact);

UserRouter.get("/contacts", authMiddleware, getContacts);
UserRouter.put("/update-contact/:contactId", authMiddleware, updateEmergencyContact);
// Delete emergency contact
UserRouter.delete("/delete-contact/:contactId", authMiddleware, deleteEmergencyContact);
UserRouter.get("/verify-token", authMiddleware, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});



export default UserRouter;