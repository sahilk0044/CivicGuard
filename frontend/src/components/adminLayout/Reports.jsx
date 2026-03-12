import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#ef4444", "#22c55e", "#f59e0b", "#3b82f6"];

const Reports = () => {

  const [data, setData] = useState(null);

  useEffect(() => {

    AOS.init({ duration: 800 });

    fetchReports();

  }, []);

  const fetchReports = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/alerts/all-reports",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setData(res.data);

    } catch (error) {

      console.error("Error fetching reports:", error);

    }

  };

  if (!data) return <p style={{ color: "white" }}>Loading reports...</p>;

  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        color: "white",
        width: "100%",
        boxSizing: "border-box"
      }}
    >

      <h2 style={{ marginBottom: "20px" }}>
        📊 System Reports
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          width: "100%"
        }}
      >

        {/* ALERTS BY TYPE */}

        <motion.div
          data-aos="fade-up"
          style={{
            padding: "20px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            boxSizing: "border-box"
          }}
        >

          <h4>Alerts by Type</h4>

          <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.alertsByType || []}
                  dataKey="count"
                  nameKey="_id"
                  outerRadius={80}
                >
                  {(data.alertsByType || []).map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </motion.div>


        {/* ALERTS PER DAY */}

        <motion.div
          data-aos="fade-up"
          style={{
            padding: "20px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            boxSizing: "border-box"
          }}
        >

          <h4>Alerts Per Day</h4>

          <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.alertsPerDay || []}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </motion.div>


        {/* STATUS REPORT */}

        <motion.div
          data-aos="fade-up"
          style={{
            padding: "20px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            boxSizing: "border-box"
          }}
        >

          <h4>Alert Status</h4>

          <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={data.statusReport || []}
                  dataKey="count"
                  nameKey="_id"
                  outerRadius={80}
                >
                  {(data.statusReport || []).map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>
          </div>

        </motion.div>


        {/* TOP USERS */}

        <motion.div
          data-aos="fade-up"
          style={{
            padding: "20px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            boxSizing: "border-box",
            wordBreak: "break-word"
          }}
        >

          <h4>Top Users Sending Alerts</h4>

          {(data.topUsers || []).map((user, index) => (

            <p key={index}>
              User ID: {user._id} — {user.alerts} alerts
            </p>

          ))}

        </motion.div>

      </div>

    </motion.div>

  );

};

export default Reports;