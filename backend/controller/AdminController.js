import User from "../models/User.js";
import Alert from "../models/Alert.js";
import Authority from "../models/Authority.js";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";



const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error('No recipient specified for email');

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls:{
      rejectUnauthorized:false,
    }
  });

  const mailOptions = { 
    from: process.env.EMAIL, 
    to, 
    subject, 
    html 
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return reject(error);
      }
      console.log('Email sent:', info && info.response ? info.response : info);
      resolve(info);
    });
  });
};




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
      { expiresIn: "30h" }   // longer login session for PWA
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

    /* GENERATE PASSWORD IF NOT PROVIDED */
    const plainPassword =
      password || Math.random().toString(36).slice(-8);

    /* HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

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

    /* SEND EMAIL WITH CREDENTIALS */
    const html = `
      <h2>Welcome to CivicGuard 🚨</h2>
      <p>Hello ${name},</p>

      <p>Your authority account has been created.</p>

      <h3>Login Credentials:</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${plainPassword}</p>

      <p>Please login and change your password immediately.</p>

      <br/>
      <p>Regards,<br/>CivicGuard Team</p>
    `;

    try {
      await sendEmail({
        to: email,
        subject: "Your Authority Account Credentials",
        html
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(201).json({
      message: "Authority added & credentials sent to email ✅",
      authority
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getAdminProfile = async (req, res) => {
  try {

    // 🔥 Check if middleware attached user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized: No user info"
      });
    }

    const admin = await Admin.findById(req.user.id).select("-password");

    // 🔥 Check if admin exists
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    res.status(200).json(admin);

  } catch (error) {

    console.error("Get Admin Profile Error:", error);

    res.status(500).json({
      error: error.message
    });

  }
};

/* ================= UPDATE Admin PROFILE ================= */



export const updateAdminProfile = async (req, res) => {
  try {

    // 🔍 Get current admin first (to delete old image)
    const existingAdmin = await Admin.findById(req.user.id);

    if (!existingAdmin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const updateData = {};

    if (req.file) {

      // ✅ DELETE OLD IMAGE
      if (
        existingAdmin.profileImage &&
        fs.existsSync(existingAdmin.profileImage)
      ) {
        fs.unlinkSync(existingAdmin.profileImage);
      }

      // ✅ SAVE NEW IMAGE
      updateData.profileImage = req.file.path;
    }

    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      admin
    });

  } catch (error) {

    console.log("UPDATE ERROR:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};