import React from "react";
import { motion } from "framer-motion";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

const AdminNavbar = ({ setSidebarOpen }) => {

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "15px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white"
      }}
    >

      {/* Left Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

        {/* Hamburger Menu */}
        <FaBars
          onClick={() => setSidebarOpen(true)}
          style={{
            cursor: "pointer",
            fontSize: "18px"
          }}
        />

        <h5 style={{ margin: 0 }}>Admin Dashboard</h5>

      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        <motion.div whileHover={{ scale: 1.2 }} style={{ cursor: "pointer" }}>
          <FaBell size={18} />
        </motion.div>

        <motion.div whileHover={{ scale: 1.2 }} style={{ cursor: "pointer" }}>
          {/* <FaUserCircle size={22} /> */}
        </motion.div>

      </div>

    </motion.div>
  );
};

export default AdminNavbar;