import React, { useEffect, useState, useRef } from "react";
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
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(); // ✅ NEW

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/authority/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
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

  /* ✅ CLICK AVATAR */
  const handleAvatarClick = () => {
    if (editing) {
      fileInputRef.current.click();
    }
  };

  /* ✅ IMAGE CHANGE */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const saveProfile = async () => {
    try {

      const data = new FormData();
      data.append("phone", formData.phone);

      if (image) {
        data.append("profileImage", image);
      }

      const res = await axios.put(
        "http://localhost:8000/api/authority/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const updated = res.data.authority;

      setProfile(updated);
      setFormData(updated);

      setEditing(false);
      setImage(null);

    } catch (error) {
      console.log("Update error:", error);
    }
  };

  const cancelEdit = () => {
    setFormData(profile);
    setEditing(false);
    setImage(null);
  };

  return (

    <div className="profile-page">

      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <div className="profile-header">

          {/* ✅ CLICKABLE PROFILE IMAGE */}
          <div
            onClick={handleAvatarClick}
            style={{ cursor: editing ? "pointer" : "default" }}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="profile-img"
              />
            ) : profile.profileImage ? (
              <img
                src={`http://localhost:8000/${profile.profileImage}`}
                alt="profile"
                className="profile-img"
              />
            ) : (
              <FaUserShield size={60} />
            )}
          </div>

          {/* 🔥 HIDDEN INPUT */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <h3>{profile.name}</h3>

          <span className="badge bg-primary">
            {profile.department}
          </span>

        </div>

        <div className="profile-body">

          <div className="profile-field">
            <FaEnvelope />
            <input type="text" value={formData.email || ""} disabled />
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
        backdrop-filter:blur(12px);
        padding:30px;
        border-radius:15px;
        border:1px solid rgba(255,255,255,0.08);
        color:white;
      }

      .profile-header{
        text-align:center;
        margin-bottom:25px;
      }

      .profile-img{
        width:110px;
        height:110px;
        border-radius:50%;
        object-fit:cover;
        border:3px solid #22c55e;
        transition:0.3s;
      }

      .profile-img:hover{
        transform:scale(1.05);
        box-shadow:0 5px 20px rgba(0,0,0,0.3);
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