import Authority from "../models/Authority.js";
import Alert from "../models/Alert.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


/* ================= LOGIN AUTHORITY ================= */

export const loginAuthority = async (req, res) => {
  try {

    const { email, password } = req.body;

    console.log("Login Email:", email);

    const authority = await Authority.findOne({
      email: email.toLowerCase()
    });

    //console.log("Authority found:", authority);

    if (!authority) {
      return res.status(404).json({ message: "Authority not found" });
    }

    const isMatch = await bcrypt.compare(password, authority.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: authority._id, role: "authority" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      authority
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= VIEW ALERTS ================= */
import mongoose from "mongoose";

export const getAuthorityAlerts = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

   

    const alerts = await Alert.find({
      authority: new mongoose.Types.ObjectId(req.user.id)
    })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

   

    res.json(alerts);

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: error.message });
  }
};
/* ================= RESOLVE ALERT ================= */

export const resolveAlert = async (req, res) => {

  const alert = await Alert.findOneAndUpdate(
    {
      _id: req.params.id,
      authority: req.user.id
    },
    { status: "resolved" },
    { new: true }
  );

  if (!alert) {
    return res.status(404).json({
      message: "Alert not found or not assigned to you"
    });
  }

  res.json({
    message: "Alert resolved",
    alert
  });

};
/* ================= GET ALL AUTHORITIES ================= */

export const getAllAuthorities = async (req, res) => {

  try {

    const authorities = await Authority.find().sort({ createdAt: -1 });

    res.json(authorities);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



/* ================= DELETE AUTHORITY ================= */

export const deleteAuthority = async (req, res) => {

  try {

    const authority = await Authority.findByIdAndDelete(req.params.id);

    if (!authority) {
      return res.status(404).json({ message: "Authority not found" });
    }

    res.json({ message: "Authority deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
/* ================= GET AUTHORITY PROFILE ================= */

export const getAuthorityProfile = async (req, res) => {

  try {

    const authority = await Authority.findById(req.user.id)
      .select("-password");

    if (!authority) {
      return res.status(404).json({
        message: "Authority not found"
      });
    }

    res.json(authority);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


/* ================= UPDATE AUTHORITY PROFILE ================= */

export const updateAuthorityProfile = async (req, res) => {

  try {

    const { phone } = req.body;

    const authority = await Authority.findById(req.user.id);

    if (!authority) {
      return res.status(404).json({
        message: "Authority not found"
      });
    }

    authority.phone = phone || authority.phone;

    const updatedAuthority = await authority.save();

    res.json({
      message: "Profile updated successfully",
      authority: updatedAuthority
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};