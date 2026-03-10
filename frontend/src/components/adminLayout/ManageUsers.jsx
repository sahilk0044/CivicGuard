import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaTrash, FaUser, FaPhone } from "react-icons/fa";

const ManageUsers = () => {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800 });
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ color: "white" }}
    >

      <h2 style={{ marginBottom: "20px" }}>
        👥 User Management
      </h2>


      {/* USERS GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: "20px"
        }}
      >

        {users.map(user => (

          <motion.div
            key={user._id}
            whileHover={{ scale: 1.05 }}
            data-aos="fade-up"
            style={{
              padding: "20px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >

            <div style={{ fontSize: "30px" }}>
              <FaUser />
            </div>

            <h4>{user.name}</h4>

            <p style={{ opacity: 0.7 }}>
              {user.email}
            </p>

            <p style={{ opacity: 0.8 }}>
              <FaPhone /> {user.mobile}
            </p>


            <button
              onClick={() => setSelectedUser(user)}
              style={{
                marginTop: "10px",
                background: "#ef4444",
                border: "none",
                padding: "8px",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer"
              }}
            >
              <FaTrash /> Delete
            </button>

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
            justifyContent: "center"
          }}
        >

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              background: "#0f172a",
              padding: "30px",
              borderRadius: "12px",
              width: "350px",
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

              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px"
                }}
              >
                Cancel
              </button>

              <button
                onClick={deleteUser}
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

export default ManageUsers;