import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import io from "socket.io-client";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaTrash, FaMapMarkerAlt, FaUserShield } from "react-icons/fa";

const socket = io("http://localhost:8000");

const ManageAlerts = () => {

  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {

    AOS.init({ duration: 800 });

    fetchAlerts();

    /* REAL TIME NEW ALERT */

    socket.on("newAlert", (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    /* REAL TIME STATUS UPDATE */

    socket.on("alertUpdated", (updatedAlert) => {
      setAlerts(prev =>
        prev.map(a => a._id === updatedAlert._id ? updatedAlert : a)
      );
    });

    /* REAL TIME AUTHORITY ASSIGNMENT */

    socket.on("alertAssigned", (data) => {

      setAlerts(prev =>
        prev.map(a =>
          a._id === data.alert._id ? data.alert : a
        )
      );

    });

  }, []);



  const fetchAlerts = async () => {

    const res = await axios.get(
      "http://localhost:8000/api/alerts/all-alerts"
    );

    setAlerts(res.data);

  };



  const deleteAlert = async () => {

    await axios.delete(
      `http://localhost:8000/api/alerts/delete/${selectedAlert._id}`
    );

    setAlerts(alerts.filter(a => a._id !== selectedAlert._id));

    setSelectedAlert(null);

  };



  const getStatusColor = (status) => {

    if (status === "active") return "#ef4444";
    if (status === "assigned") return "#f59e0b";
    if (status === "resolved") return "#22c55e";

    return "white";

  };



  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ color: "white" }}
    >

      <h2 style={{ marginBottom: "20px" }}>
        🚨 Alerts Control Room
      </h2>



      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
          gap: "20px"
        }}
      >

        {alerts.map(alert => (

          <motion.div
            key={alert._id}
            whileHover={{ scale: 1.04 }}
            data-aos="fade-up"
            style={{
              padding: "20px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >

            <h4>🚨 {alert.type?.toUpperCase()} ALERT</h4>

            {/* USER */}

            <p>
              User: {alert.user?.name || "Unknown"}
            </p>

            {/* LOCATION */}

            <p>
              <FaMapMarkerAlt /> {alert.locationName || "Location unavailable"}
            </p>

            {/* AUTHORITY */}

            <p>
              <FaUserShield /> Authority:
              {" "}
              {alert.authority?.name || "Not Assigned"}
            </p>

            {/* STATUS */}

            <p>
              Status:
              <strong
                style={{
                  color: getStatusColor(alert.status)
                }}
              >
                {" "} {alert.status?.toUpperCase()}
              </strong>
            </p>


            {/* VIDEO EVIDENCE */}

            {alert.video && (

              <video
                width="100%"
                controls
                style={{ marginTop: "10px", borderRadius: "8px" }}
              >
                <source src={`http://localhost:8000/${alert.video}`} />
              </video>

            )}


            {/* DELETE BUTTON */}

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >

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



      {/* DELETE MODAL */}

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
            justifyContent: "center"
          }}
        >

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              background: "#0f172a",
              padding: "30px",
              borderRadius: "12px",
              width: "350px",
              textAlign: "center"
            }}
          >

            <h3>Delete Alert</h3>

            <p>
              Delete alert
              <strong> {selectedAlert.type}</strong>?
            </p>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "10px"
              }}
            >

              <button
                onClick={() => setSelectedAlert(null)}
              >
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