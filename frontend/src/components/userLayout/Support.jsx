import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const Support = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [helperText, setHelperText] = useState(
    "Need assistance? We're here to help."
  );

  useEffect(() => {

    AOS.init({ duration: 1000 });

    const messages = [
      "Need assistance? We're here to help.",
      "Facing an issue with CivicGuard?",
      "Your safety is our priority.",
      "Send us a message and our team will assist you."
    ];

    let i = 0;

    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setHelperText(messages[i]);
    }, 3500);

    return () => clearInterval(interval);

  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:8000/api/users/support",
        formData
      );

      if (res.status === 200) {
        setSuccess(true);
        setError(false);

        setFormData({
          name: "",
          email: "",
          message: ""
        });
      }

    } catch (err) {
      console.error(err);
      setError(true);
    }

    setLoading(false);

    setTimeout(() => {
      setSuccess(false);
      setError(false);
    }, 4000);
  };

  /* 🔥 WHATSAPP + CHAT FUNCTIONS */

  const openWhatsApp = () => {
    const phone = "8660455892"; // 🔥 replace with your number
    const message = `Hello, I need support regarding CivicGuard`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const openChat = () => {
    alert("💬 Live chat coming soon! 🚀");
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1e3c72,#2a5298)",
        paddingTop: "90px",
        paddingBottom: "70px"
      }}
    >
      <Container>

        {/* HEADING */}

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white mb-5"
        >
          <h1 style={{ fontWeight: "700" }}>CivicGuard Support</h1>
          <p style={{ fontSize: "18px", opacity: 0.9 }}>
            {helperText}
          </p>
        </motion.div>

        {/* FORM */}

        <Row className="justify-content-center">

          <Col md={7}>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <Card className="shadow-lg border-0 rounded-4">

                <Card.Body className="p-4">

                  <h4 className="text-center mb-4">
                    Send a Support Request
                  </h4>

                  {success && (
                    <Alert variant="success">
                      ✅ Message sent successfully!
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="danger">
                      ❌ Failed to send message.
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <div className="d-grid">

                      <Button type="submit" disabled={loading}>

                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Sending...
                          </>
                        ) : "Send Message"}

                      </Button>

                    </div>

                  </Form>

                </Card.Body>

              </Card>

            </motion.div>

          </Col>

        </Row>

        {/* 🔥 QUICK SUPPORT (NEW SECTION) */}

        <Row className="justify-content-center mt-5">

          <Col md={6}>

            <Card className="text-center p-4 shadow-lg border-0 rounded-4">

              <h4>Need Instant Help?</h4>

              <p style={{ opacity: 0.7 }}>
                Chat with us instantly or reach out via WhatsApp
              </p>

              <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>

                <Button
                  onClick={openChat}
                  style={{ background: "#3b82f6", border: "none" }}
                >
                  💬 Chat with Us
                </Button>

                <Button
                  onClick={openWhatsApp}
                  style={{ background: "#25D366", border: "none" }}
                >
                  📱 WhatsApp Support
                </Button>

              </div>

            </Card>

          </Col>

        </Row>

        {/* FEATURES */}

        <Row className="text-white text-center mt-5">

          <Col md={4}>
            <h5>⚡ Fast Response</h5>
            <p>Quick assistance from our support team.</p>
          </Col>

          <Col md={4}>
            <h5>🔒 Secure</h5>
            <p>Your data is always safe.</p>
          </Col>

          <Col md={4}>
            <h5>🛟 Assistance</h5>
            <p>Connecting you with authorities.</p>
          </Col>

        </Row>

      </Container>
    </div>
  );
};

export default Support;