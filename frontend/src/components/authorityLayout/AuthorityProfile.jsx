import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";

const AuthorityProfile = () => {

  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/authority/profile",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setProfile(res.data);
      setFormData(res.data);

    } catch (error) {

      console.log("Profile fetch error:", error);

    }

  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const saveProfile = async () => {

    try {

      const res = await axios.put(
        "http://localhost:8000/api/authority/profile",
        formData,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setProfile(res.data.authority || res.data);
      setEditing(false);

    } catch (error) {

      console.log("Update error:", error);

    }

  };

  const cancelEdit = () => {

    setFormData(profile);
    setEditing(false);

  };

  return (

    <div className="profile-page">

      <motion.div
        className="profile-card"
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
      >

        <div className="profile-header">

          <FaUserShield size={60} />

          <h3>{profile.name}</h3>

          <span className="badge bg-primary">
            {profile.department}
          </span>

        </div>

        <div className="profile-body">

          <div className="profile-field">

            <FaEnvelope />

            <input
              type="text"
              value={formData.email || ""}
              disabled
            />

          </div>

          <div className="profile-field">

            <FaPhone />

            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              disabled={!editing}
              onChange={handleChange}
            />

          </div>

          <div className="profile-field">

            <FaBuilding />

            <input
              type="text"
              value={formData.department || ""}
              disabled
            />

          </div>

        </div>

        <div className="profile-actions">

          {!editing ? (

            <button
              className="btn btn-primary"
              onClick={() => setEditing(true)}
            >
              <FaEdit /> Edit
            </button>

          ) : (

            <>
              <button
                className="btn btn-success"
                onClick={saveProfile}
              >
                <FaSave /> Save
              </button>

              <button
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                <FaTimes /> Cancel
              </button>
            </>

          )}

        </div>

      </motion.div>


      <style>{`

      .profile-page{
        display:flex;
        justify-content:center;
        padding:40px 20px;
      }

      .profile-card{
        width:100%;
        max-width:450px;
        background:rgba(255,255,255,0.05);
        backdrop-filter:blur(10px);
        padding:30px;
        border-radius:15px;
        border:1px solid rgba(255,255,255,0.08);
        color:white;
      }

      .profile-header{
        text-align:center;
        margin-bottom:25px;
      }

      .profile-header h3{
        margin-top:10px;
      }

      .profile-body{
        display:flex;
        flex-direction:column;
        gap:15px;
      }

      .profile-field{
        display:flex;
        align-items:center;
        gap:10px;
        background:#020617;
        padding:12px;
        border-radius:8px;
      }

      .profile-field input{
        flex:1;
        background:none;
        border:none;
        outline:none;
        color:white;
      }

      .profile-actions{
        margin-top:25px;
        display:flex;
        justify-content:flex-end;
        gap:10px;
      }

      @media(max-width:600px){

        .profile-actions{
          flex-direction:column;
        }

      }

      `}</style>

    </div>

  );

};

export default AuthorityProfile;