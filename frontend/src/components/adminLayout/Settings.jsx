import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const Settings = () => {

  const [settings, setSettings] = useState({
    systemName: "",
    emergencyEmail: "",
    notifications: false,
    autoAssignAuthority: false,
    alertCooldownSeconds: 30,
    authorityRadiusKm: 10,
    autoDispatch: true,
    enableActivityLogs: true
  });

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/admin/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSettings(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value
    });

  };

  const handleSave = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:8000/api/admin/settings",
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Settings updated successfully");

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ color: "white", width: "100%" }}
    >

      <h2 style={{ marginBottom: "20px" }}>
        ⚙ System Settings
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px"
        }}
      >

        {/* SYSTEM CONFIG */}

        <div style={{
          padding: "20px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)"
        }}>

          <h4>System Configuration</h4>

          <label>System Name</label>

          <input
            type="text"
            name="systemName"
            value={settings.systemName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />

          <label style={{ marginTop: "10px", display: "block" }}>
            Emergency Email
          </label>

          <input
            type="email"
            name="emergencyEmail"
            value={settings.emergencyEmail}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />

        </div>


        {/* ALERT SECURITY */}

        <div style={{
          padding: "20px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)"
        }}>

          <h4>Alert Security</h4>

          <label>Emergency Alert Cooldown (seconds)</label>

          <input
            type="number"
            name="alertCooldownSeconds"
            value={settings.alertCooldownSeconds}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />

        </div>


        {/* AUTHORITY SETTINGS */}

        <div style={{
          padding: "20px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)"
        }}>

          <h4>Authority Dispatch</h4>

          <label>Authority Radius (KM)</label>

          <input
            type="number"
            name="authorityRadiusKm"
            value={settings.authorityRadiusKm}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          />

          <label style={{ marginTop: "10px", display: "block" }}>
            <input
              type="checkbox"
              name="autoDispatch"
              checked={settings.autoDispatch}
              onChange={handleChange}
            />
            Enable Auto Dispatch
          </label>

        </div>


        {/* SYSTEM LOGGING */}

        <div style={{
          padding: "20px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)"
        }}>

          <h4>System Logs</h4>

          <label>
            <input
              type="checkbox"
              name="enableActivityLogs"
              checked={settings.enableActivityLogs}
              onChange={handleChange}
            />
            Enable Activity Logging
          </label>

        </div>

      </div>


      {/* SAVE BUTTON */}

      <button
        onClick={handleSave}
        style={{
          marginTop: "20px",
          background: "#22c55e",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer"
        }}
      >
        Save Settings
      </button>

    </motion.div>

  );

};

export default Settings;