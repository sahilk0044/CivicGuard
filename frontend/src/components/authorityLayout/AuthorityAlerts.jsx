import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaVideo, FaCheckCircle } from "react-icons/fa";

const AuthorityAlerts = () => {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {

    try {

      const res = await axios.get(
"http://localhost:8000/api/authority/alerts",
{
 headers:{
  Authorization:`Bearer ${localStorage.getItem("token")}`
 }
}
)

      setAlerts(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const resolveAlert = async (id) => {

    try {

      await axios.put(
        `http://localhost:8000/api/authority/alerts/${id}/resolve`
      );

      fetchAlerts();

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div style={{ color: "white" }}>

      <h2 style={{ marginBottom: "25px", fontWeight: "600" }}>
        🚨 Emergency Alerts
      </h2>

      <div className="row g-4">

        {alerts.map(alert => (

          <div className="col-lg-4 col-md-6" key={alert._id}>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="alert-card"
            >

              <h4>
                SOS Alert
              </h4>

              <p>
                User: {alert.user?.name || "Unknown"}
              </p>

              <p>
                <FaMapMarkerAlt />{" "}
                {alert.location?.latitude},
                {alert.location?.longitude}
              </p>

              {alert.video && (

                <video
                  src={alert.video}
                  controls
                  width="100%"
                  style={{ borderRadius: "8px" }}
                />

              )}

              <div className="alert-actions">

                <button
                  className="btn btn-success"
                  onClick={() => resolveAlert(alert._id)}
                >
                  <FaCheckCircle /> Resolve
                </button>

              </div>

            </motion.div>

          </div>

        ))}

      </div>

      <style>{`

      .alert-card{
        background:rgba(255,255,255,0.05);
        padding:20px;
        border-radius:14px;
        backdrop-filter:blur(12px);
        border:1px solid rgba(255,255,255,0.08);
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