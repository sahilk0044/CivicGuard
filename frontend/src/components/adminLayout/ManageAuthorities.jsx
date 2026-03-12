import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaTrash, FaUserShield, FaPhone } from "react-icons/fa";

const ManageAuthorities = () => {

  const [authorities, setAuthorities] = useState([]);
  const [selectedAuthority, setSelectedAuthority] = useState(null);

  useEffect(() => {

    AOS.init({ duration: 800 });

    fetchAuthorities();

  }, []);

  const fetchAuthorities = async () => {

    const res = await axios.get(
      "http://localhost:8000/api/authority/authorities"
    );

    setAuthorities(res.data);

  };

  const deleteAuthority = async () => {

    try {

      await axios.delete(
        `http://localhost:8000/api/authority/authorities/${selectedAuthority._id}`
      );

      setAuthorities(
        authorities.filter(a => a._id !== selectedAuthority._id)
      );

      setSelectedAuthority(null);

    } catch (error) {

      console.log(error);

    }

  };

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
        🛡 Authority Management
      </h2>

      {/* AUTHORITY GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: "20px",
          width: "100%"
        }}
      >

        {authorities.map(authority => (

          <motion.div
            key={authority._id}
            whileHover={{ scale: 1.05 }}
            data-aos="fade-up"
            style={{
              padding: "20px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxSizing: "border-box",
              wordBreak: "break-word"
            }}
          >

            <div style={{ fontSize: "30px" }}>
              <FaUserShield />
            </div>

            <h4>{authority.name}</h4>

            <p style={{ opacity: 0.7 }}>
              {authority.email}
            </p>

            <p style={{ opacity: 0.8 }}>
              <FaPhone /> {authority.mobile}
            </p>

            <button
              onClick={() => setSelectedAuthority(authority)}
              style={{
                marginTop: "10px",
                background: "#ef4444",
                border: "none",
                padding: "8px",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                width: "100%"
              }}
            >
              <FaTrash /> Delete
            </button>

          </motion.div>

        ))}

      </div>


      {/* DELETE MODAL */}

      {selectedAuthority && (

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
            justifyContent: "center",
            padding: "20px"
          }}
        >

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              background: "#0f172a",
              padding: "30px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "350px",
              textAlign: "center",
              boxSizing: "border-box"
            }}
          >

            <h3>Delete Authority</h3>

            <p>
              Are you sure you want to delete
              <br />
              <strong>{selectedAuthority.name}</strong>?
            </p>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}
            >

              <button
                onClick={() => setSelectedAuthority(null)}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px"
                }}
              >
                Cancel
              </button>

              <button
                onClick={deleteAuthority}
                style={{
                  padding: "8px 14px",
                  background: "#ef4444",
                  border: "none",
                  borderRadius: "6px",
                  color: "white"
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

export default ManageAuthorities;