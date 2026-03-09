import React from "react";
import { motion } from "framer-motion";

const AdminFooter = () => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{
        background: "#020617",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "12px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "14px"
      }}
    >

      © {new Date().getFullYear()} CivicGuard Admin Panel • Secure Emergency System

    </motion.div>
  );
};

export default AdminFooter;