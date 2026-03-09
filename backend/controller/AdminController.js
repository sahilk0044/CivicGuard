import User from "../models/User.js";
import Alert from "../models/Alert.js";

/* ================= GET ALL USERS ================= */

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
    const activeAlerts = await Alert.countDocuments({ status: "active" });

    res.json({
      totalUsers,
      totalAlerts,
      activeAlerts,
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