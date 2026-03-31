import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTrash, FaUser, FaPhone } from "react-icons/fa";

const ManageUsers = () => {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:8000/api/admin/users"
    );
    setUsers(res.data);
  };

  const deleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/admin/users/${selectedUser._id}`
      );

      setUsers(users.filter(user => user._id !== selectedUser._id));
      setSelectedUser(null);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        color: "white",
        width: "100%",
        boxSizing: "border-box"
      }}
    >

      <h2 style={{ marginBottom: "20px" }}>
        👥 User Management
      </h2>

      {/* USERS GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: "20px",
          width: "100%"
        }}
      >

        {users.map(user => (

          <motion.div
            layout
            key={user._id}
            whileHover={{ scale: 1.05 }}
            style={{
              padding: "20px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxSizing: "border-box",
              wordBreak: "break-word",
              textAlign: "center"
            }}
          >

            {/* ✅ PROFILE IMAGE */}
            <div style={{ marginBottom: "10px" }}>
              {user.profileImage ? (
                <img
                  src={`http://localhost:8000/${user.profileImage}`}
                  alt="profile"
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #22c55e"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "#1f2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto"
                  }}
                >
                  <FaUser size={30} />
                </div>
              )}
            </div>

            <h4>{user.name}</h4>

            <p style={{ opacity: 0.7 }}>
              {user.email}
            </p>

            <p style={{ opacity: 0.8 }}>
              <FaPhone /> {user.mobile}
            </p>

          </motion.div>

        ))}

      </div>

      {/* DELETE MODAL */}

      {selectedUser && (

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
            layout
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              background: "#0f172a",
              padding: "30px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "350px",
              textAlign: "center"
            }}
          >

            <h3>Delete User</h3>

            <p>
              Are you sure you want to delete
              <br />
              <strong>{selectedUser.name}</strong>?
            </p>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                justifyContent: "center"
              }}
            >

              <button onClick={() => setSelectedUser(null)}>
                Cancel
              </button>

              <button
                onClick={deleteUser}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px"
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

export default ManageUsers;