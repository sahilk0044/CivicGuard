import Alert from "../models/Alert.js";
import User from "../models/User.js";
import Authority from "../models/Authority.js";


/* ================= CREATE ALERT ================= */

export const sendAlert = async (req, res) => {
  try {

    const { type, description, latitude, longitude, location } = req.body;

    const video = req.file ? req.file.path : null;

    const alert = new Alert({
      user: req.user._id,
      type,
      description,
      latitude,
      longitude,
      location,
      video,
      status: "active"
    });

    await alert.save();

    /* ===== REAL TIME SOCKET EVENT ===== */

    const io = req.app.get("io");
    io.emit("newAlert", alert);

    res.status(201).json({
      message: "Emergency alert sent successfully",
      alert
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= GET ALL ALERTS ================= */

export const getAllAlerts = async (req, res) => {
  try {

    const alerts = await Alert.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(alerts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= GET USER ALERTS ================= */

export const getUserAlerts = async (req, res) => {
  try {

    const alerts = await Alert.find({ user: req.user._id })
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

    /* REAL-TIME UPDATE */

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

    const alertsCount = await Alert.countDocuments({ status: "active" });

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