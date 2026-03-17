import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCheckCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const AuthorityAlerts = () => {
  const navigate=useNavigate();
  const [alerts, setAlerts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/authority/alerts",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Alerts:", res.data);

      setAlerts(res.data);

    } catch (error) {

      console.log("Fetch error:", error.response?.data || error);

    }

  };

  const resolveAlert = async (id) => {

    try {

      await axios.put(
        `http://localhost:8000/api/authority/resolve/${id}`, // ✅ FIXED
        {},
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ REQUIRED
          }
        }
      );

      fetchAlerts();

    } catch (error) {

      console.log("Resolve error:", error.response?.data || error);

    }

  };

  return (

    <div style={{ color: "white" }}>

      <h2 style={{ marginBottom: "25px", fontWeight: "600" }}>
        🚨 Emergency Alerts
      </h2>

      <div className="row g-4">

        {alerts.length === 0 ? (
          <p>No alerts assigned</p>
        ) : (

          alerts.map(alert => (

            <div className="col-lg-4 col-md-6" key={alert._id}>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="alert-card"
              >

                <h4>SOS Alert</h4>

                <p>
                  <strong>User:</strong>{" "}
                  {alert.user?.name || "Unknown"}
                </p>

                {/* ✅ FIXED LOCATION */}
                <p>
                  <FaMapMarkerAlt />{" "}
                  {alert.locationName || `${alert.latitude}, ${alert.longitude}`}
                </p>

                {/* ✅ MAP LINK */}
                <button
                  className="btn btn-info btn-sm mt-2"
                  onClick={() =>
                    navigate("/authority/map", {
                      state: {
                        latitude: alert.latitude,
                        longitude: alert.longitude,
                        locationName: alert.locationName
                      }
                    })
                  }
                >
                  View on Map
                </button>

                {/* ✅ FIXED VIDEO */}
                {alert.video && (
                  <video
                    controls
                    width="100%"
                    style={{ borderRadius: "8px", marginTop: "10px" }}
                  >
                    <source
                      src={`http://localhost:8000/${alert.video}`}
                      type="video/mp4"
                    />
                  </video>
                )}

                {/* STATUS */}
                <p style={{ marginTop: "10px" }}>
                  Status:{" "}
                  {alert.status === "resolved" ? (
                    <span className="badge bg-success">
                      Resolved
                    </span>
                  ) : (
                    <span className="badge bg-warning text-dark">
                      Pending
                    </span>
                  )}
                </p>

                {/* ACTION */}
                {alert.status !== "resolved" && (
                  <div className="alert-actions">

                    <button
                      className="btn btn-success"
                      onClick={() => resolveAlert(alert._id)}
                    >
                      <FaCheckCircle /> Resolve
                    </button>

                  </div>
                )}

              </motion.div>

            </div>

          ))

        )}

      </div>

      <style>{`

      .alert-card{
        background:rgba(255,255,255,0.05);
        padding:20px;
        border-radius:14px;
        backdrop-filter:blur(12px);
        border:1px solid rgba(255,255,255,0.08);
        transition:0.3s;
      }

      .alert-card:hover{
        box-shadow:0 10px 25px rgba(0,0,0,0.3);
      }

      .alert-card h4{
        margin-bottom:10px;
      }

      .alert-actions{
        margin-top:15px;
        display:flex;
        justify-content:flex-end;
      }

      `}</style>

    </div>

  );

};

export default AuthorityAlerts;