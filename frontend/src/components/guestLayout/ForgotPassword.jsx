import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";

const ForgotPassword = () => {

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
        "http://localhost:8000/api/users/forgotpassword",
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
        background: "radial-gradient(circle at top, #1f3c88, #0f2027)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <Card
            style={{
              width: "420px",
              borderRadius: "22px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <Card.Body style={{ padding: "35px" }}>

              <h2
                className="text-center mb-2"
                style={{
                  fontWeight: "700",
                  letterSpacing: "1px",
                }}
              >
                🔐 Forgot Password
              </h2>

              <p
                className="text-center mb-4"
                style={{
                  color: "#bbb",
                  fontSize: "14px",
                }}
              >
                Enter your registered email to receive a temporary password
              </p>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "500" }}>
                    Email Address
                  </Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      borderRadius: "14px",
                      padding: "14px",
                      fontSize: "15px",
                      border: "none",
                    }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading}
                  style={{
                    borderRadius: "14px",
                    padding: "14px",
                    fontWeight: "600",
                    fontSize: "16px",
                    background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
                    border: "none",
                    boxShadow: "0 5px 20px rgba(255,126,95,0.4)",
                    transition: "all 0.3s ease",
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

export default ForgotPassword;