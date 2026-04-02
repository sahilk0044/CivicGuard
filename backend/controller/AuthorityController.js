import Authority from "../models/Authority.js";
import Alert from "../models/Alert.js";
import bcrypt from "bcryptjs";
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


/* ================= LOGIN AUTHORITY ================= */


export const loginAuthority = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }
// console.log("Incoming Email:", email);
    // 🔥 FIX: normalize email properly
    const authority = await Authority.findOne({
      email: email.trim().toLowerCase()
    });
// console.log("Authority Found:", authority?._id, authority?.email);

    if (!authority) {
      return res.status(404).json({
        message: "Authority not found"
      });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, authority.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }
    

    // 🔐 Generate token (CORRECT USER)
    const token = jwt.sign(
      {
        id: authority._id,role:authority.role,
        role: "authority"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 VERY IMPORTANT: remove password before sending
    const { password: _, ...authorityData } = authority._doc;

    res.status(200).json({
      message: "Login successful",
      token,
      user: authorityData   // ✅ consistent with frontend
    });

  } catch (error) {

    console.error("Login Error:", error);
    console.log("Entered:", password);
console.log("Stored:", authority.password);

    res.status(500).json({
      error: error.message
    });

  }
};


export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const authority = await Authority.findOne({ email });

    if (!authority) {
      return res.status(404).json({ message: "Authority not found" });
    }

    // 🔥 Generate temp password
    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated temp password:", tempPassword);

    // ✅ HASH PASSWORD HERE (IMPORTANT)
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    authority.password = hashedPassword;

    await authority.save();

    // 📧 Send email
    const html = `
      <p>Hello ${authority.name},</p>
      <p>A password reset was requested for your account.</p>
      <p><strong>Temporary password:</strong> ${tempPassword}</p>
      <p>Please login and change your password immediately.</p>
      <p>Best regards,<br>CivicGuard</p>
    `;

    try {
      await sendEmail({
        to: authority.email,
        subject: "Password Reset - Temporary Password",
        html
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
      return res.status(500).json({
        message: "Password created but email failed"
      });
    }

    return res.status(200).json({
      message: "Temporary password sent to your email ✅"
    });

  } catch (error) {

    console.error("forgotPassword error:", error);

    return res.status(500).json({
      message: "Failed to reset password ❌",
      error: error.message
    });

  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    // Get logged-in authority
    const authority = await Authority.findById(req.user.id);

    if (!authority) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, authority.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    // 🔥 HASH NEW PASSWORD (same as forgotPassword)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    authority.password = hashedPassword;

    await authority.save();

    return res.status(200).json({
      message: "Password changed successfully ✅",
    });

  } catch (error) {
    console.error("changePassword error:", error);

    return res.status(500).json({
      message: "Failed to change password ❌",
      error: error.message,
    });
  }
};


/* ================= VIEW ALERTS ================= */



export const getAuthorityAlerts = async (req, res) => {
  try {

    // ✅ Check user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // ✅ Fetch alerts assigned to this authority
    const alerts = await Alert.find({
      authority: req.user._id
    })
      .populate("user", "name email mobile")
      .populate("authority", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);

  } catch (error) {
    console.log("Error fetching authority alerts:", error);

    res.status(500).json({
      message: "Failed to fetch alerts ❌",
      error: error.message
    });
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

    // ✅ Get existing authority (needed for deleting old image)
    const authority = await Authority.findById(req.user._id);

    if (!authority) {
      return res.status(404).json({
        message: "Authority not found"
      });
    }

    // ✅ Update phone
    authority.phone = phone || authority.phone;

    // ✅ IMAGE UPDATE (WITH DELETE OLD IMAGE)
    if (req.file) {

      // 🔥 DELETE OLD IMAGE
      if (
        authority.profileImage &&
        fs.existsSync(authority.profileImage)
      ) {
        fs.unlinkSync(authority.profileImage);
      }

      // ✅ SAVE NEW IMAGE
      authority.profileImage = req.file.path;
    }

    const updatedAuthority = await authority.save();

    res.status(200).json({
      message: "Profile updated successfully ✅",
      authority: updatedAuthority
    });

  } catch (error) {

    console.log("Update error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};