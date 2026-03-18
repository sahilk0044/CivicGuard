import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
  FaBell,
  FaChartBar,
  FaCog,
  FaTimes
} from "react-icons/fa";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Authorities", path: "/admin/authorities", icon: <FaUserShield /> },
    { name: "Alerts", path: "/admin/alerts", icon: <FaBell /> },
    { name: "Reports", path: "/admin/reports", icon: <FaChartBar /> },
    { name: "Logout", path: "/admin/login" }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 90
          }}
        />
      )}

      <motion.div
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "260px",
          height: "100vh",
          background: "linear-gradient(145deg,#0f172a,#020617)",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          padding: "25px",
          position: "fixed",
          left: sidebarOpen ? "0" : "-260px",
          top: 0,
          transition: "0.3s",
          zIndex: 100
        }}
      >

        {/* Close button (mobile) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontWeight: "600", letterSpacing: "1px" }}>
              CivicGuard
            </h3>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>
              Admin Control
            </span>
          </div>

          <FaTimes
            onClick={() => setSidebarOpen(false)}
            style={{ cursor: "pointer", fontSize: "18px" }}
          />
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "40px" }}>

          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              data-aos="fade-right"
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 15px",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "15px",
                color: isActive ? "#38bdf8" : "#e2e8f0",
                background: isActive
                  ? "rgba(56,189,248,0.15)"
                  : "transparent",
                transition: "all 0.3s ease"
              })}
            >
              <motion.div whileHover={{ scale: 1.2 }}>
                {item.icon}
              </motion.div>

              {item.name}
            </NavLink>
          ))}

        </div>

      </motion.div>
    </>
  );
};

export default AdminSidebar;