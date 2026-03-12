import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaTrash, FaUserShield, FaPhone } from "react-icons/fa";

const ManageAuthorities = () => {

  const [authorities, setAuthorities] = useState([]);
  const [selectedAuthority, setSelectedAuthority] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "police",
    password: "",
    latitude: "",
    longitude: ""
  });

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

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const addAuthority = async () => {

    try {

      await axios.post(
        "http://localhost:8000/api/admin/add-authority",
        {
          ...formData,
          location: {
            latitude: formData.latitude,
            longitude: formData.longitude
          }
        }
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "police",
        password: "",
        latitude: "",
        longitude: ""
      });

      fetchAuthorities();

    } catch (error) {

      console.log(error);

    }

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
      style={{ color: "white", width: "100%" }}
    >

      <h2 style={{ marginBottom: "25px" }}>
        🛡 Authority Management
      </h2>

      {/* ADD AUTHORITY FORM */}

      <motion.div
        data-aos="fade-up"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: "30px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.12)",
          marginBottom: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
        }}
      >

        <h4 style={{ marginBottom: "20px", fontWeight: "600" }}>
          ➕ Add New Authority
        </h4>

        <div className="row g-3">

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Authority Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <select
              className="form-select"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="police">🚓 Police</option>
              <option value="medical">🏥 Medical</option>
              <option value="fire">🔥 Fire</option>
            </select>
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
            />
          </div>

        </div>

        <motion.div
          style={{ marginTop: "25px", textAlign: "right" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >

          <button
            onClick={addAuthority}
            className="btn btn-success px-4 py-2"
            style={{
              borderRadius: "10px",
              fontWeight: "600"
            }}
          >
            ➕ Add Authority
          </button>

        </motion.div>

      </motion.div>


      {/* AUTHORITY GRID */}

      <div
        className="row g-4"
      >

        {authorities.map(authority => (

          <div className="col-lg-4 col-md-6" key={authority._id}>

            <motion.div
              whileHover={{ scale: 1.05 }}
              data-aos="fade-up"
              style={{
                padding: "25px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >

              <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                <FaUserShield />
              </div>

              <h4>{authority.name}</h4>

              <p style={{ opacity: 0.7 }}>
                {authority.email}
              </p>

              <p>
                <FaPhone /> {authority.phone}
              </p>

              <p style={{ fontSize: "14px" }}>
                Department: {authority.department}
              </p>

              <button
                onClick={() => setSelectedAuthority(authority)}
                className="btn btn-danger w-100"
              >
                <FaTrash /> Delete
              </button>

            </motion.div>

          </div>

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
              textAlign: "center",
              width: "350px"
            }}
          >

            <h3>Delete Authority</h3>

            <p>
              Are you sure you want to delete
              <br />
              <strong>{selectedAuthority.name}</strong>?
            </p>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent:"center" }}>

              <button
                onClick={() => setSelectedAuthority(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={deleteAuthority}
                className="btn btn-danger"
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