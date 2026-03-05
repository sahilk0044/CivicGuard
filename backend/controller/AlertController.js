import dotenv from "dotenv";
dotenv.config();
import Alert from "../models/Alert.js";
import User from "../models/User.js";
import Authority from "../models/Authority.js";
import nodemailer from "nodemailer";

/* ================= EMAIL TRANSPORT ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


/* ================= SEND EMERGENCY ALERT ================= */

export const sendAlert = async (req, res) => {
  try {

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const video = req.file ? req.file.path : null;

    /* SAVE ALERT */

    const alert = await Alert.create({
      user: req.user.id,
      latitude,
      longitude,
      video,
    });

    /* GET USER */

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* ================= GET EMERGENCY CONTACT EMAILS ================= */

    const contactEmails = user.emergencyContacts
      ?.filter((contact) => contact.email)
      .map((contact) => contact.email) || [];

    /* ================= GET AUTHORITY EMAILS ================= */

    const authorities = await Authority.find();

    const authorityEmails = authorities
      .filter((auth) => auth.email)
      .map((auth) => auth.email);

    /* ================= MERGE ALL RECIPIENT EMAILS ================= */

    const recipients = [...new Set([...contactEmails, ...authorityEmails])];

    console.log("Emergency contacts:", contactEmails);
    console.log("Authority emails:", authorityEmails);
    console.log("Recipients:", recipients);

    /* ================= SEND EMAIL ================= */

    if (recipients.length > 0) {

      const mailOptions = {
        from: process.env.EMAIL,
        to: recipients.join(","),
        subject: "🚨 Emergency Alert Triggered",
        text: `
🚨 Emergency Alert!

User: ${user.name}
Mobile: ${user.mobile}

Location:
Latitude: ${latitude}
Longitude: ${longitude}

Please provide immediate assistance.
        `,
      };

      await transporter.sendMail(mailOptions);

      console.log("Emergency alert email sent");
    }

    res.status(201).json({
      message: "Emergency alert created successfully",
      alert,
    });

  } catch (error) {

    console.error("Alert Error:", error);

    res.status(500).json({
      message: "Error sending alert",
    });

  }
};

/* ================= USER ALERT HISTORY ================= */

export const getUserAlerts = async (req, res) => {
  try {

    const alerts = await Alert.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(alerts);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching alerts",
    });

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

    res.status(500).json({
      message: "Error fetching alerts",
    });

  }
};

/* ================= UPDATE ALERT STATUS ================= */

export const updateAlertStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    res.json({
      message: "Alert status updated",
      alert,
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating alert status",
    });

  }
};
console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);