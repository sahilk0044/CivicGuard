import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserShield, FaEnvelope, FaPhone, FaBuilding } from "react-icons/fa";

const AuthorityProfile = () => {

  const [authority, setAuthority] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/authority/profile"
      );

      setAuthority(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    setAuthority({
      ...authority,
      [e.target.name]: e.target.value
    });

  };

  const updateProfile = async () => {

    try {

      await axios.put(
        "http://localhost:8000/api/authority/profile",
        authority
      );

      setEditing(false);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div style={{ color: "white" }}>

      <h2 style={{ marginBottom: "25px", fontWeight: "600" }}>
        👤 Authority Profile
      </h2>

      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        className="profile-card"
      >

        <div className="profile-avatar">
          <FaUserShield size={50} />
        </div>

        <div className="profile-info">

          <label>Name</label>

          <input
            type="text"
            name="name"
            value={authority.name || ""}
            disabled={!editing}
            onChange={handleChange}
            className="form-control"
          />

          <label>Email</label>

          <input
            type="text"
            name="email"
            value={authority.email || ""}
            disabled
            className="form-control"
          />

          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={authority.phone || ""}
            disabled={!editing}
            onChange={handleChange}
            className="form-control"
          />

          <label>Department</label>

          <input
            type="text"
            name="department"
            value={authority.department || ""}
            disabled
            className="form-control"
          />

          <div className="profile-actions">

            {editing ? (

              <button
                className="btn btn-success"
                onClick={updateProfile}
              >
                Save Changes
              </button>

            ) : (

              <button
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>

            )}

          </div>

        </div>

      </motion.div>


      <style>{`

      .profile-card{
        max-width:600px;
        background:rgba(255,255,255,0.05);
        padding:30px;
        border-radius:16px;
        backdrop-filter:blur(12px);
        border:1px solid rgba(255,255,255,0.08);
      }

      .profile-avatar{
        text-align:center;
        margin-bottom:20px;
      }

      .profile-info label{
        margin-top:10px;
        font-size:14px;
        opacity:0.7;
      }

      .profile-info input{
        margin-bottom:10px;
      }

      .profile-actions{
        margin-top:20px;
        display:flex;
        justify-content:flex-end;
      }

      `}</style>

    </div>

  );

};

export default AuthorityProfile;