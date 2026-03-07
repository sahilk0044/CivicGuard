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

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center text-white mb-5"
        >
          <h1 style={{ fontWeight: "700" }}>CivicGuard Support</h1>
          <p style={{ fontSize: "18px", opacity: 0.9 }}>
            {helperText}
          </p>
        </motion.div>

        <Row className="justify-content-center">

          <Col md={7}>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >

              <Card
                className="shadow-lg border-0 rounded-4"
                data-aos="fade-up"
                style={{ backdropFilter: "blur(10px)" }}
              >

                <Card.Body className="p-4">

                  <h4 className="text-center mb-4">
                    Send a Support Request
                  </h4>

                  {success && (
                    <Alert variant="success">
                      ✅ Message sent successfully! Our team will contact you soon.
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="danger">
                      ❌ Failed to send message. Please try again.
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3">

                      <Form.Label>Name</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
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
                        placeholder="Enter your email"
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
                        placeholder="Describe your issue or question..."
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />

                    </Form.Group>

                    <div className="d-grid">

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >

                        <Button
                          variant="primary"
                          type="submit"
                          size="lg"
                          disabled={loading}
                        >

                          {loading ? (
                            <>
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                              />
                              Sending...
                            </>
                          ) : (
                            "Send Message"
                          )}

                        </Button>

                      </motion.div>

                    </div>

                  </Form>

                </Card.Body>

              </Card>

            </motion.div>

          </Col>

        </Row>

        {/* Support Features */}

        <Row className="text-white text-center mt-5">

          <Col md={4} data-aos="fade-up">

            <h5>⚡ Fast Response</h5>
            <p>Our support team responds as quickly as possible.</p>

          </Col>

          <Col md={4} data-aos="fade-up" data-aos-delay="200">

            <h5>🔒 Secure Support</h5>
            <p>Your data and messages remain completely secure.</p>

          </Col>

          <Col md={4} data-aos="fade-up" data-aos-delay="400">

            <h5>🛟 Civic Assistance</h5>
            <p>Helping citizens connect with the right authorities.</p>

          </Col>

        </Row>

      </Container>
    </div>
  );
};

export default Support;