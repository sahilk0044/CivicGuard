import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaTrash, FaUserShield, FaPhone, FaEnvelope } from "react-icons/fa";

const ManageAuthorities = () => {

  const [authorities, setAuthorities] = useState([]);
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "police",
    password: "",
    latitude: "",
    longitude: ""
  });

  const [image, setImage] = useState(null); // ✅ NEW

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchAuthorities();
  }, []);

  const fetchAuthorities = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/authority/authorities"
      );
      setAuthorities(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addAuthority = async (e) => {

    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {

      // ✅ USE FORMDATA
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("department", formData.department);
      data.append("password", formData.password);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);

      if (image) {
        data.append("profileImage", image); // ✅ IMAGE
      }

      await axios.post(
        "http://localhost:8000/api/admin/add-authority",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setSuccessMsg("Authority added successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "police",
        password: "",
        latitude: "",
        longitude: ""
      });

      setImage(null); // reset image
      fetchAuthorities();

      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);

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

      <h2 style={{ marginBottom: "25px", fontWeight: "600" }}>
        🛡 Authority Management
      </h2>

      {successMsg && (
        <div className="alert alert-success">
          {successMsg}
        </div>
      )}

      {/* ADD AUTHORITY FORM */}

      <motion.form
        onSubmit={addAuthority}
        data-aos="fade-up"
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
            <div className="input-group">
              <span className="input-group-text"><FaUserShield /></span>
              <input
                className="form-control"
                placeholder="Authority Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                className="form-control"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text"><FaPhone /></span>
              <input
                className="form-control"
                placeholder="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
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

          {/* ✅ IMAGE INPUT */}
          <div className="col-md-6">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

        </div>

        <div style={{ marginTop: "25px", textAlign: "right" }}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-success px-4 py-2"
            style={{
              borderRadius: "10px",
              fontWeight: "600"
            }}
          >
            ➕ Add Authority
          </motion.button>
        </div>

      </motion.form>

      {/* AUTHORITY GRID */}

      <div className="row g-4">

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

              {/* ✅ SHOW IMAGE */}
              <div style={{ marginBottom: "10px" }}>
                {authority.profileImage ? (
                  <img
                    src={`http://localhost:8000/${authority.profileImage}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <FaUserShield size={32} />
                )}
              </div>

              <h4>{authority.name}</h4>
              <p style={{ opacity: 0.7 }}>{authority.email}</p>
              <p><FaPhone /> {authority.phone}</p>
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

    </motion.div>

  );

};

export default ManageAuthorities;