import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import io from "socket.io-client";
import { FaTrash, FaMapMarkerAlt, FaUserShield } from "react-icons/fa";

const socket = io("http://localhost:8000");

const ManageAlerts = () => {

  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {

    fetchAlerts();

    socket.on("newAlert", (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    socket.on("alertUpdated", (updatedAlert) => {
      setAlerts(prev =>
        prev.map(a => a._id === updatedAlert._id ? updatedAlert : a)
      );
    });

    socket.on("alertAssigned", (data) => {
      setAlerts(prev =>
        prev.map(a =>
          a._id === data.alert._id ? data.alert : a
        )
      );
    });

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      socket.off("newAlert");
      socket.off("alertUpdated");
      socket.off("alertAssigned");
    };

  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/alerts/all-alerts",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAlerts(res.data);

    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const deleteAlert = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8000/api/alerts/delete/${selectedAlert._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAlerts(alerts.filter(a => a._id !== selectedAlert._id));
      setSelectedAlert(null);

    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const getStatusColor = (status) => {
    if (status === "active") return "#ef4444";
    if (status === "assigned") return "#f59e0b";
    if (status === "resolved") return "#22c55e";
    return "white";
  };

  return (

    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ color: "white", width: "100%", boxSizing: "border-box" }}
    >

      <h2 style={{ marginBottom: "20px" }}>
        🚨 Alerts Control Room
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "20px",
          width: "100%"
        }}
      >

        {alerts.map(alert => (

          <motion.div
            layout
            key={alert._id}
            whileHover={{ scale: 1.04 }}
            style={{
              padding: "20px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxSizing: "border-box",
              wordBreak: "break-word"
            }}
          >

            <h4>🚨 {alert.type?.toUpperCase()} ALERT</h4>

            <p>User: {alert.user?.name || "Unknown"}</p>

            <p>
              <FaMapMarkerAlt /> {alert.locationName || "Location unavailable"}
            </p>

            <p>
              <FaUserShield /> Authority:{" "}
              {alert.authority?.name || "Not Assigned"}
            </p>

            <p>
              Status:
              <strong style={{ color: getStatusColor(alert.status) }}>
                {" "} {alert.status?.toUpperCase()}
              </strong>
            </p>

            {alert.video && (
              <video
                controls
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "8px"
                }}
              >
                <source src={`http://localhost:8000/${alert.video}`} />
              </video>
            )}

            <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedAlert(alert)}
                style={{
                  background: "#ef4444",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                <FaTrash />
              </button>
            </div>

          </motion.div>

        ))}

      </div>

      {selectedAlert && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >

          <motion.div
            layout
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              background: "#0f172a",
              padding: "30px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "350px",
              textAlign: "center"
            }}
          >

            <h3>Delete Alert</h3>

            <p>
              Delete alert <strong>{selectedAlert.type}</strong>?
            </p>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>

              <button onClick={() => setSelectedAlert(null)}>
                Cancel
              </button>

              <button
                onClick={deleteAlert}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px"
                }}
              >
                Delete
              </button>

            </div>

          </motion.div>

        </div>

      )}

    </motion.div>
  );
};

export default ManageAlerts;