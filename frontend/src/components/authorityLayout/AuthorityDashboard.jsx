import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import {
  FaBell,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt
} from "react-icons/fa";

const AuthorityDashboard = () => {

  const [alerts, setAlerts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAlerts();

    // 🔥 SOCKET CONNECTION
    const socket = io("http://localhost:8000");

    // 🔥 WHEN NEW ALERT COMES
    socket.on("newAlert", (newAlert) => {

      // Only add if assigned to this authority
      if (newAlert.authority === JSON.parse(localStorage.getItem("authority"))?._id) {
        setAlerts(prev => [newAlert, ...prev]);
      }

    });

    // 🔥 WHEN ALERT UPDATED (resolved etc.)
    socket.on("alertUpdated", (updatedAlert) => {

      setAlerts(prev =>
        prev.map(alert =>
          alert._id === updatedAlert._id
            ? updatedAlert
            : alert
        )
      );

    });

    return () => socket.disconnect();

  }, []);

  const fetchAlerts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/authority/alerts",
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ FIXED
          }
        }
      );

      setAlerts(res.data);

    } catch (error) {

      console.log("Fetch error:", error.response?.data || error);

    }

  };

  const totalAlerts = alerts.length;
  const pendingAlerts = alerts.filter(a => a.status !== "resolved").length;
  const resolvedAlerts = alerts.filter(a => a.status === "resolved").length;

  return (

    <div style={{ color: "white" }}>

      <h2 style={{ marginBottom: "25px", fontWeight: "600" }}>
        🚨 Authority Dashboard
      </h2>

      {/* STATISTICS */}

      <div className="row g-4">

        <div className="col-lg-4 col-md-6">
          <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card">
            <FaBell size={32} />
            <h4>{totalAlerts}</h4>
            <p>Total Alerts</p>
          </motion.div>
        </div>

        <div className="col-lg-4 col-md-6">
          <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card">
            <FaClock size={32} />
            <h4>{pendingAlerts}</h4>
            <p>Pending Alerts</p>
          </motion.div>
        </div>

        <div className="col-lg-4 col-md-6">
          <motion.div whileHover={{ scale: 1.05 }} className="dashboard-card">
            <FaCheckCircle size={32} />
            <h4>{resolvedAlerts}</h4>
            <p>Resolved Alerts</p>
          </motion.div>
        </div>

      </div>

      {/* TABLE */}

      <div
        style={{
          marginTop: "40px",
          background: "rgba(255,255,255,0.05)",
          padding: "25px",
          borderRadius: "14px",
          backdropFilter: "blur(10px)"
        }}
      >

        <h4 style={{ marginBottom: "20px" }}>
          Recent Emergency Alerts
        </h4>

        <div className="table-responsive">

          <table className="table table-dark table-hover">

            <thead>
              <tr>
                <th>User</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {alerts.slice(0,5).map(alert => (

                <tr key={alert._id}>

                  <td>{alert.user?.name || "Unknown"}</td>

                  <td>
                    <FaMapMarkerAlt />{" "}
                    {alert.locationName || `${alert.latitude}, ${alert.longitude}`}
                  </td>

                  <td>
                    {alert.status === "resolved" ? (
                      <span className="badge bg-success">Resolved</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <style>{`

        .dashboard-card{
          background: rgba(255,255,255,0.05);
          padding: 25px;
          border-radius: 14px;
          backdrop-filter: blur(12px);
          text-align: center;
          border:1px solid rgba(255,255,255,0.08);
        }

      `}</style>

    </div>

  );

};

export default AuthorityDashboard;