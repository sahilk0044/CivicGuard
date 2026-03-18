import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import AlertsChart from "./AlertsChart";
import AlertsFeed from "./AlertsFeed";
import IncidentMap from "./IncidentMap";
import VideoEvidence from "./VideoEvidence";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate=useNavigate();
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {

        const res = await axios.get("http://localhost:8000/api/admin/dashboard");

        setStats(res.data);
        setAlerts(res.data.latestAlerts);

      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();

  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ color: "white", width: "100%" }}
    >

      {/* ===== STAT CARDS ===== */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        <div style={{ flex: "1 1 220px" }}>
            <div onClick={() => navigate("/admin/users")} style={{ cursor: "pointer" }}>
          <StatCard
            title="Users"
            value={stats.usersCount || 0}
            icon="👥"
          />
          </div>
        </div>

        <div style={{ flex: "1 1 220px" }}>
          <div onClick={() => navigate("/admin/authorities")} style={{ cursor: "pointer" }}>
          <StatCard
            title="Authorities"
            value={stats.authoritiesCount || 0}
            icon="🛡"
          />
          </div>
        </div>

        <div style={{ flex: "1 1 220px" }}>
           <div onClick={() => navigate("/admin/alerts")} style={{ cursor: "pointer" }}>
          <StatCard
            title="Active Alerts"
            value={stats.alertsCount || 0}
            icon="🚨"
          />
          </div>
        </div>

        <div style={{ flex: "1 1 220px" }}>
          <div onClick={() => navigate("/admin/alerts")} style={{ cursor: "pointer" }}>
          <StatCard
            title="Resolved Cases"
            value={stats.resolvedCases || 0}
            icon="✔"
          />
          </div>
        </div>

      </div>

      {/* ===== CHART + ALERTS ===== */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        <div style={{ flex: "1 1 400px", minWidth: "280px" }}>
          <AlertsChart />
        </div>

        <div style={{ flex: "1 1 350px", minWidth: "280px" }}>
            <div onClick={() => navigate("/admin/alerts")} style={{ cursor: "pointer" }}>
          <AlertsFeed alerts={alerts} />
          </div>
        </div>

      </div>

      {/* ===== MAP + VIDEO ===== */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >

        <div style={{ flex: "1 1 400px", minWidth: "280px" }}>
          <IncidentMap alerts={alerts} />
        </div>

        <div style={{ flex: "1 1 350px", minWidth: "280px" }}>
          {/* <VideoEvidence alerts={alerts} /> */}
        </div>

      </div>

    </motion.div>
  );
};

export default AdminDashboard;