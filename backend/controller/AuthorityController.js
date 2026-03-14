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

    const alerts = await Alert.find({
      authority: req.user.id   // only alerts assigned to this authority
    })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json(alerts);

  } catch (error) {
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