import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

const ForgotPassword1 = () => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/authority/forgot-password",
        { email }
      );

      setMessage(res.data.message);
      setLoading(false);

    } catch (err) {

      setError(
        err.response?.data?.message || "Something went wrong"
      );

      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #141E30, #243B55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <Card
            style={{
              width: "400px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            <Card.Body style={{ padding: "30px" }}>

              <h3 className="text-center mb-3" style={{ fontWeight: "600" }}>
                🔐 Forgot Password
              </h3>

              <p className="text-center mb-4" style={{ color: "#ccc" }}>
                Enter your email to receive a temporary password
              </p>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  style={{
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #36D1DC, #5B86E5)",
                    border: "none",
                    transition: "0.3s",
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" /> Sending...
                    </>
                  ) : (
                    "Send Temporary Password"
                  )}
                </Button>

              </Form>

            </Card.Body>
          </Card>

        </motion.div>

      </Container>
    </div>
  );
};

export default ForgotPassword1;