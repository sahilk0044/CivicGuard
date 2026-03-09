import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StatCard from "./StatCard";
import AlertsChart from "./AlertsChart";
import AlertsFeed from "./AlertsFeed";
import IncidentMap from "./IncidentMap";
import VideoEvidence from "./VideoEvidence";


const AdminDashboard = () => {

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
      style={{ color: "white" }}
    >

      {/* ===== STAT CARDS ===== */}

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>

        <StatCard
          title="Users"
          value={stats.usersCount || 0}
          icon="👥"
        />

        <StatCard
          title="Authorities"
          value={stats.authoritiesCount || 0}
          icon="🛡"
        />

        <StatCard
          title="Active Alerts"
          value={stats.alertsCount || 0}
          icon="🚨"
        />

        <StatCard
          title="Resolved Cases"
          value={stats.resolvedCases || 0}
          icon="✔"
        />

      </div>

      {/* ===== CHART + ALERTS ===== */}

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>

        <AlertsChart />

        <AlertsFeed alerts={alerts} />

      </div>

      {/* ===== MAP + VIDEO ===== */}

      <div style={{ display: "flex", gap: "20px" }}>

        <IncidentMap alerts={alerts} />

        <VideoEvidence alerts={alerts} />

      </div>

    </motion.div>
  );
};

export default AdminDashboard;