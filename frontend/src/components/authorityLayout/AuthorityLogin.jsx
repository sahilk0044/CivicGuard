import React, { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";

const AuthorityLogin = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      localStorage.clear();

    try {

      const res = await axios.post(
        "http://localhost:8000/api/authority/authority-login",
        formData
      );

      console.log("Login Response:", res.data);

      // 🔥 CLEAR OLD DATA (important)
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 🔥 STORE TOKEN + USER
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 DEBUG (VERY IMPORTANT)
      console.log("Stored Token:", res.data.token);
      console.log("Logged in User:", res.data.user);

      // 🔥 ROLE CHECK (safety)
      if (res.data.user.role !== "authority") {
        setError("Access denied. Not an authority account.");
        return;
      }

      navigate("/authority/dashboard");

    } catch (err) {

      console.error("Login Error:", err);

      setError(
        err.response?.data?.message || "Login failed"
      );

    }
  };

  return (

    <div className="authority-login-page">

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <div className="login-header">

          <FaUserShield size={50} />

          <h3>Authority Login</h3>

          <p>Login to CivicGuard Authority Panel</p>

        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <FaEnvelope />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-link">
            <NavLink to="/forgot-password">Forgot Password?</NavLink>
          </div>

          <button className="login-btn">
            Login
          </button>

        </form>

      </motion.div>

      <style>{`
      .authority-login-page{
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:linear-gradient(135deg,#8b0000,#ff0000);
        padding:20px;
      }

      .login-card{
        width:100%;
        max-width:400px;
        background:white;
        padding:35px;
        border-radius:14px;
        box-shadow:0 10px 30px rgba(0,0,0,0.4);
      }

      .login-header{
        color:black;
        text-align:center;
        margin-bottom:25px;
      }

      .input-group{
        display:flex;
        align-items:center;
        gap:10px;
        background:#020617;
        padding:12px;
        border-radius:8px;
        margin-bottom:15px;
      }

      .input-group input{
        flex:1;
        border:none;
        outline:none;
        background:none;
        color:white;
      }

      .login-btn{
        width:100%;
        padding:12px;
        border:none;
        border-radius:8px;
        background:#2563eb;
        color:white;
        font-weight:600;
      }

      .auth-link{
        margin-bottom:10px;
      }

      .auth-link a{
        color:#ff0000;
        text-decoration:none;
        font-weight:500;
      }
      `}</style>

    </div>
  );
};

export default AuthorityLogin;