import Alert from "../models/Alert.js";
import User from "../models/User.js";
import Authority from "../models/Authority.js";
import nodemailer from "nodemailer";

/* ================= DISTANCE FUNCTION ================= */

function calculateDistance(lat1, lon1, lat2, lon2) {

  const R = 6371; // Earth radius in KM

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in KM
}


/* ================= CREATE ALERT ================= */

export const sendAlert = async (req, res) => {
  try {

    const { type, latitude, longitude, locationName } = req.body;

    const video = req.file ? req.file.path : null;

    const alert = new Alert({
      user: req.user._id,
      type,
      latitude,
      longitude,
      locationName,
      video,
      status: "active"
    });

    /* STEP 2: Find authorities of same department */

    const authorities = await Authority.find({
      department: type
    });

    let nearestAuthority = null;
    let minDistance = Infinity;

    /* STEP 3: Find nearest authority */

    authorities.forEach((auth) => {

      if (!auth.location) return;

      const distance = calculateDistance(
        latitude,
        longitude,
        auth.location.latitude,
        auth.location.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestAuthority = auth;
      }

    });

    /* STEP 4: Assign authority */

    if (nearestAuthority) {
      alert.authority = nearestAuthority._id;
      alert.status = "assigned";
    }

    await alert.save();

    /* ================== NEW EMAIL PART START ================== */

    const user = await User.findById(req.user._id);

    if (user && user.emergencyContacts && user.emergencyContacts.length > 0) {

      const emails = user.emergencyContacts.map(c => c.email);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: emails,
        subject: "🚨 Emergency Alert!",
        html: `
          <h2>🚨 Emergency Alert Triggered</h2>
          <p><strong>User:</strong> ${user.name}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Location:</strong> ${locationName}</p>
          <p><strong>Coordinates:</strong> ${latitude}, ${longitude}</p>
          <p>
            <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">
              View Location on Map
            </a>
          </p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    /* ================== NEW EMAIL PART END ================== */

    /* STEP 5: REAL TIME SOCKET EVENTS */

    const io = req.app.get("io");

    io.emit("newAlert", alert);

    if (nearestAuthority) {
      io.emit("alertAssigned", {
        alert,
        authorityId: nearestAuthority._id
      });
    }

    res.status(201).json({
      message: "Emergency alert sent and authority assigned",
      alert,
      assignedAuthority: nearestAuthority
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET ALL ALERTS ================= */

export const getAllAlerts = async (req, res) => {

  try {

    const alerts = await Alert.find()
      .populate("user", "name email phone")
      .populate("authority", "name department")
      .sort({ createdAt: -1 });

    res.json(alerts);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



/* ================= GET USER ALERTS ================= */

export const getUserAlerts = async (req, res) => {
  try {

    const alerts = await Alert.find({
      user: req.user._id
    })
  .populate("authority", "name department phone") // ✅ ADD THIS
      .sort({ createdAt: -1 });
    res.json(alerts);

   

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= UPDATE ALERT STATUS ================= */

export const updateAlertStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.status = status;

    await alert.save();

    const io = req.app.get("io");

    io.emit("alertUpdated", alert);

    res.json({
      message: "Alert status updated",
      alert
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= DELETE ALERT ================= */

export const deleteAlert = async (req, res) => {
  try {

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    await alert.deleteOne();

    res.json({
      message: "Alert deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= DASHBOARD STATS ================= */

export const getDashboardStats = async (req, res) => {
  try {

    const usersCount = await User.countDocuments();
    const authoritiesCount = await Authority.countDocuments();
    const alertsCount = await Alert.countDocuments({ status: "assigned" });
    const resolvedCases = await Alert.countDocuments({ status: "resolved" });

    const latestAlerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      usersCount,
      authoritiesCount,
      alertsCount,
      resolvedCases,
      latestAlerts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= ALERT CHART DATA ================= */

export const getAlertsChart = async (req, res) => {
  try {

    const chartData = await Alert.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(chartData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= REPORTS ================= */

export const getReports = async (req, res) => {
  try {

    const alertsByType = await Alert.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    const alertsPerDay = await Alert.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const statusReport = await Alert.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const topUsers = await Alert.aggregate([
      {
        $group: {
          _id: "$user",
          alerts: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: "$userInfo.name",
          alerts: 1
        }
      },
      { $sort: { alerts: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      alertsByType,
      alertsPerDay,
      statusReport,
      topUsers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};