import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";

const AdminLogin = () => {

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

    try {

      const res = await axios.post(
        "http://localhost:8000/api/admin/login",
        formData
      );

      localStorage.setItem("token", res.data.token);

      navigate("/admin/dashboard");

    } catch (err) {

      setError(err.response?.data?.message || "Login failed");

    }

  };

  return (

    <div className="authority-login-page">

      <motion.div
        className="login-card"
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
      >

        <div className="login-header">

          <FaUserShield size={50} />

          <h3>Admin Login</h3>

          <p>Login to CivicGuard Admin Panel</p>

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
        background:white;
        color:white;
        padding:20px;
        background:linear-gradient(135deg,#8b0000,#ff0000);
      }

      .login-card{
        width:100%;
        max-width:400px;
        background:white;
        backdrop-filter:blur(12px);
        padding:35px;
        border-radius:14px;
        border:1px solid rgba(255,255,255,0.08);
        box-shadow:0 10px 30px rgba(0,0,0,0.4);
      }

      .login-header{
      color:black;
        text-align:center;
        margin-bottom:25px;
      }

      .login-header h3{
        margin-top:10px;
        font-weight:600;
      }

      .login-header p{
        opacity:0.7;
        font-size:14px;
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
        transition:0.3s;
      }

      .login-btn:hover{
        background:#1d4ed8;
      }

      `}</style>

    </div>

  );

};

export default AdminLogin;