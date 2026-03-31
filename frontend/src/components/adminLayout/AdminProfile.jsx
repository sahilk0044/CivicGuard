import React, { useEffect, useState } from "react";
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

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchProfile();
  }, []);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/admin/admin-profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(res.data);

      setFormData({
        email: res.data.email,
        role: res.data.role
      });

      setLoading(false);

    } catch (err) {
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= UPDATE PROFILE ================= */

  const updateProfile = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const form = new FormData();

      if (formData.profileImage) {
        form.append("profileImage", formData.profileImage);
      }

      const res = await axios.put(
        "http://localhost:8000/api/admin/admin-profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage("Profile updated successfully ✅");
      setEditMode(false);
      fetchProfile();

    } catch (err) {
      setError("Failed to update profile ❌");
    }
  };

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
        background: linear-gradient(135deg, #fdf2f8, #eef2ff, #e0f2fe);
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
      }

      .profile-avatar{
        width:90px;
        height:90px;
        border-radius:50%;
        background:white;
        display:flex;
        align-items:center;
        justify-content:center;
        margin:auto;
        margin-bottom:20px;
        overflow:hidden;
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

                  {/* PROFILE IMAGE */}
                  <div className="profile-avatar">
                    {user.profileImage ? (
                      <img
                        src={`http://localhost:8000/${user.profileImage}`}
                        alt="profile"
                      />
                    ) : (
                      <FaUser size={30} color="#007bff" />
                    )}
                  </div>

                  <h4 className="text-center mb-4">Admin Profile</h4>

                  {message && <Alert variant="success">{message}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={updateProfile}>

                    {/* EMAIL */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaEnvelope /> Email
                      </Form.Label>

                      <Form.Control
                        type="email"
                        value={formData.email}
                        disabled
                      />
                    </Form.Group>

                    {/* ROLE */}
                    <Form.Group className="mb-3">
                      <Form.Label>🛡️ Role</Form.Label>

                      <Form.Control
                        type="text"
                        value={formData.role}
                        disabled
                      />
                    </Form.Group>

                    {/* IMAGE */}
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Image</Form.Label>

                      <Form.Control
                        type="file"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profileImage: e.target.files[0]
                          })
                        }
                        disabled={!editMode}
                      />
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