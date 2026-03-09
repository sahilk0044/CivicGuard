import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon }) => {

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        flex: 1,
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)"
      }}
    >
      <h4>{icon} {title}</h4>
      <h2>{value}</h2>
    </motion.div>
  );
};

export default StatCard;