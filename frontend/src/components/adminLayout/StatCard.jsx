import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon }) => {

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        width: "100%",
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxSizing: "border-box"
      }}
    >
      <h4 style={{ marginBottom: "10px", wordBreak: "break-word" }}>
        {icon} {title}
      </h4>

      <h2 style={{ margin: 0 }}>
        {value}
      </h2>
    </motion.div>
  );
};

export default StatCard;