import User from "../models/User.js";
import Alert from "../models/Alert.js";
import Authority from "../models/Authority.js";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";


export const Adminlogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    /* normalize email */
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    /* check password */

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    /* create token */

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }   // longer login session for PWA
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};/* ================= GET ALL USERS ================= */

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DELETE USER ================= */

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET ALL ALERTS ================= */

export const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= DASHBOARD STATS ================= */

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAlerts = await Alert.countDocuments();
    const assignedAlerts = await Alert.countDocuments({ status:"assigned" });

    res.json({
      totalUsers,
      totalAlerts,
      assignedAlerts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAlertsChart = async (req, res) => {
  try {

    const chartData = await Alert.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(chartData);

  } catch (error) {
    res.status(500).json(error.message);
  }
};

/* ================= ADD AUTHORITY (ADMIN) ================= */

export const addAuthority = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      department,
      password,
      location
    } = req.body;

    /* CHECK EXISTING AUTHORITY */

    const existingAuthority = await Authority.findOne({ email });

    if (existingAuthority) {
      return res.status(400).json({
        message: "Authority with this email already exists"
      });
    }

    /* HASH PASSWORD */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* CREATE AUTHORITY */

    const authority = new Authority({
      name,
      email,
      phone,
      department,
      password: hashedPassword,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      role: "authority"
    });

    await authority.save();

    res.status(201).json({
      message: "Authority added successfully",
      authority
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};