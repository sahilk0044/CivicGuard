import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUser, FaEnvelope } from "react-icons/fa";

const AdminProfile = () => {

  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    profileImage: null
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchProfile();
  }, []);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: Please login again");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:8000/api/admin/admin-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(res.data);

      setFormData({
        email: res.data.email,
        role: res.data.role,
        profileImage: null
      });

      setPreview(null);
      setLoading(false);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
      setLoading(false);
    }
  };

  /* ================= CLICK AVATAR ================= */

  const handleAvatarClick = () => {
    if (editMode) {
      fileInputRef.current.click();
    }
  };

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        profileImage: file
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  /* ================= UPDATE PROFILE ================= */

  const updateProfile = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: Please login again");
        return;
      }

      const form = new FormData();

      if (formData.profileImage) {
        form.append("profileImage", formData.profileImage);
      }

      await axios.put(
        "http://localhost:8000/api/admin/admin-profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 FIX
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage("Profile updated successfully ✅");
      setError(null);
      setEditMode(false);

      fetchProfile();

    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile ❌");
      setMessage(null);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <>
      <style>{`

      .profile-page{
        min-height:100vh;
       background: linear-gradient(135deg, #0B1B3A, #08142b);
        display:flex;
        align-items:center;
        justify-content:center;
        padding:40px;
      }

      .profile-card{
        width:380px;
        border-radius:18px;
        background:linear-gradient(135deg,#ff3c3c,#007bff);
        color:white;
        padding:35px;
        box-shadow:0 20px 45px rgba(0,0,0,0.25);
      }

      .profile-avatar{
        width:100px;
        height:100px;
        border-radius:50%;
        background:white;
        display:flex;
        align-items:center;
        justify-content:center;
        margin:auto;
        margin-bottom:20px;
        overflow:hidden;
        cursor:pointer;
        transition:0.3s;
      }

      .profile-avatar:hover{
        transform:scale(1.05);
        box-shadow:0 5px 20px rgba(0,0,0,0.3);
      }

      .profile-avatar img{
        width:100%;
        height:100%;
        object-fit:cover;
      }

      `}</style>

      <div className="profile-page">
        <Row>
          <Col>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              <Card className="profile-card">
                <Card.Body>

                  {/* AVATAR */}
                  <div
                    className="profile-avatar"
                    onClick={handleAvatarClick}
                    style={{ cursor: editMode ? "pointer" : "default" }}
                  >
                    {preview ? (
                      <img src={preview} alt="preview" />
                    ) : user.profileImage ? (
                      <img src={`http://localhost:8000/${user.profileImage}`} alt="profile" />
                    ) : (
                      <FaUser size={30} color="#007bff" />
                    )}
                  </div>

                  {/* HIDDEN INPUT */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <h4 className="text-center mb-4">Admin Profile</h4>

                  {message && <Alert variant="success">{message}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={updateProfile}>

                    <Form.Group className="mb-3">
                      <Form.Label><FaEnvelope /> Email</Form.Label>
                      <Form.Control type="email" value={formData.email} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>🛡️ Role</Form.Label>
                      <Form.Control type="text" value={formData.role} disabled />
                    </Form.Group>

                    {!editMode ? (
                      <Button onClick={() => setEditMode(true)} className="w-100">
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button type="submit" className="w-100 mb-2">
                          Save Changes
                        </Button>
                        <Button variant="light" onClick={() => setEditMode(false)} className="w-100">
                          Cancel
                        </Button>
                      </>
                    )}

                  </Form>

                </Card.Body>
              </Card>

            </motion.div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminProfile;