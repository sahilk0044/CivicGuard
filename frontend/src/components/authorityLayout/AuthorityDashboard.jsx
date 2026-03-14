import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBell,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt
} from "react-icons/fa";

const AuthorityDashboard = () => {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api//authority/alerts"
      );

      setAlerts(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const totalAlerts = alerts.length;
  const pendingAlerts = alerts.filter(a => a.status === "pending").length;
  const resolvedAlerts = alerts.filter(a => a.status === "resolved").length;

  return (

    <div style={{ color: "white" }}>

      <h2 style={{ marginBottom: "25px", fontWeight: "600" }}>
        🚨 Authority Dashboard
      </h2>


      {/* STATISTICS CARDS */}

      <div className="row g-4">

        <div className="col-lg-4 col-md-6">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card"
          >
            <FaBell size={32} />
            <h4>{totalAlerts}</h4>
            <p>Total Alerts</p>
          </motion.div>

        </div>

        <div className="col-lg-4 col-md-6">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card"
          >
            <FaClock size={32} />
            <h4>{pendingAlerts}</h4>
            <p>Pending Alerts</p>
          </motion.div>

        </div>

        <div className="col-lg-4 col-md-6">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="dashboard-card"
          >
            <FaCheckCircle size={32} />
            <h4>{resolvedAlerts}</h4>
            <p>Resolved Alerts</p>
          </motion.div>

        </div>

      </div>


      {/* RECENT ALERTS TABLE */}

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
                    {alert.location?.latitude},
                    {alert.location?.longitude}
                  </td>

                  <td>

                    {alert.status === "resolved" ? (

                      <span className="badge bg-success">
                        Resolved
                      </span>

                    ) : (

                      <span className="badge bg-warning">
                        Pending
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* STYLES */}

      <style>{`

        .dashboard-card{
          background: rgba(255,255,255,0.05);
          padding: 25px;
          border-radius: 14px;
          backdrop-filter: blur(12px);
          text-align: center;
          border:1px solid rgba(255,255,255,0.08);
          transition:0.3s;
        }

        .dashboard-card h4{
          margin-top:10px;
          font-size:28px;
        }

        .dashboard-card p{
          opacity:0.7;
        }

      `}</style>

    </div>

  );

};

export default AuthorityDashboard;