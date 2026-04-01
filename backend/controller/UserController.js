import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


// -------------------- EMAIL HELPER FUNCTION --------------------
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

    /* normalize email */
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    /* check password */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    /* create token */

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }   // longer login session for PWA
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 Generate temp password
    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated temp password:", tempPassword);

    // ✅ HASH PASSWORD HERE (IMPORTANT)
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    user.password = hashedPassword;

    await user.save();

    // 📧 Send email
    const html = `
      <p>Hello ${user.name},</p>
      <p>A password reset was requested for your account.</p>
      <p><strong>Temporary password:</strong> ${tempPassword}</p>
      <p>Please login and change your password immediately.</p>
      <p>Best regards,<br>CivicGuard</p>
    `;

    try {
      await sendEmail({
        to: user.email,
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

    // Get logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    // Set new password (will be hashed via pre-save hook)
    user.password = newPassword;

    await user.save();

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

    /* 🔥 SAFE FIELD UPDATES */

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    /* 🔥 IMAGE UPDATE (NEW) */
    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    console.log("USER UPDATE ERROR:", error);

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

export const updateEmergencyContact = async (req, res) => {
  try {

    const { contactId } = req.params;
    const { name1, email, phone, relationship } = req.body;

    if (!contactId) {
      return res.status(400).json({
        message: "Contact ID is required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const contact = user.emergencyContacts.id(contactId);

    if (!contact) {
      return res.status(404).json({
        message: "Emergency contact not found"
      });
    }

    // ✅ Update only provided fields
    if (name1 !== undefined) contact.name1 = name1;
    if (email !== undefined) contact.email = email;
    if (phone !== undefined) contact.phone = phone;
    if (relationship !== undefined) contact.relationship = relationship;

    await user.save();

    res.status(200).json({
      message: "Emergency contact updated successfully",
      contact
    });

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

