import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

/* ================= REGISTER USER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN USER ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET USER PROFILE ================= */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE USER PROFILE ================= */

export const updateProfile = async (req, res) => {

  try {

    const { name, email, mobile } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    /* Update fields */

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

/* ================= ADD EMERGENCY CONTACT ================= */
export const addEmergencyContact = async (req, res) => {
  try {

    const { name1, email, phone, relationship } = req.body;

    if (!name1 || !phone) {
      return res.status(400).json({
        message: "Name and phone are required"
      });
    }

    const user = await User.findById(req.user.id);

    const newContact = {
      name1,
      email,
      phone,
      relationship
    };

    user.emergencyContacts.push(newContact);

    await user.save();

    const addedContact =
      user.emergencyContacts[user.emergencyContacts.length - 1];

    res.status(201).json(addedContact);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};
/* ================= DELETE EMERGENCY CONTACT ================= */
export const deleteEmergencyContact = async (req, res) => {
  try {

    const { contactId } = req.params;

    const user = await User.findById(req.user.id);

    user.emergencyContacts = user.emergencyContacts.filter(
      contact => contact._id.toString() !== contactId
    );

    await user.save();

    res.json({
      message: "Contact deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};
export const sendContactMessage = async (req, res) => {

  const { name, email, message } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    /* ================= ADMIN EMAIL ================= */

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,   // admin email
      subject: "New CivicGuard Contact Message",
      html: `
        <h3>New Contact Message</h3>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    /* ================= AUTO REPLY TO USER ================= */

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "CivicGuard Support - Message Received",
      html: `
        <h2>Hello ${name},</h2>

        <p>Thank you for contacting <b>CivicGuard Emergency Alert System</b>.</p>

        <p>We have received your message and our team will review it shortly.</p>

        <p>If this is an emergency, please contact your local emergency services immediately.</p>

        <br/>

        <p>Stay safe,</p>
        <p><b>CivicGuard Support Team</b></p>
      `
    });

    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send message"
    });

  }

};

export const getContacts = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("emergencyContacts");

    res.json(user.emergencyContacts);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};

/*send support message*/

export const sendSupportMessage = async (req, res) => {
  try {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"CivicGuard Support" <${process.env.EMAIL}>`,
      to: process.env.ADMIN_EMAIL,

      // reply goes to user email
      replyTo: email,

      subject: "New Support Request - CivicGuard",

      html: `
        <h2>New Support Request</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>User Email:</b> ${email}</p>

        <p><b>Message:</b></p>
        <p>${message}</p>

        <hr/>

        <p>This message was sent from CivicGuard Support Page.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Support request sent successfully",
    });

  } catch (error) {

    console.error("Support Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send support request",
    });

  }
};