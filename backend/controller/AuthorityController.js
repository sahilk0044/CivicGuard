import Authority from "../models/Authority.js";
import Alert from "../models/Alert.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER AUTHORITY ================= */

export const registerAuthority = async (req, res) => {
  try {
    const { name, email, phone, department, password } = req.body;

    const existing = await Authority.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Authority already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const authority = new Authority({
      name,
      email,
      phone,
      department,
      password: hashedPassword,
    });

    await authority.save();

    res.json({
      message: "Authority registered successfully",
      authority,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN AUTHORITY ================= */

export const loginAuthority = async (req, res) => {
  try {

    const { email, password } = req.body;

    const authority = await Authority.findOne({ email });

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
      authority,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= VIEW ALERTS ================= */

export const getAuthorityAlerts = async (req, res) => {
  try {

    const alerts = await Alert.find()
      .populate("user", "name email mobile")
      .sort({ createdAt: -1 });

    res.json(alerts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= RESOLVE ALERT ================= */

export const resolveAlert = async (req, res) => {
  try {

    const { id } = req.params;

    const alert = await Alert.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true }
    );

    res.json({
      message: "Alert resolved",
      alert,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};