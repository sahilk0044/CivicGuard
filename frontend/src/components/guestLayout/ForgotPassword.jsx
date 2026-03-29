import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
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

    <Container className="d-flex justify-content-center align-items-center vh-100">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <Card
          className="shadow border-0"
          style={{ width: "400px", borderRadius: "15px" }}
        >

          <Card.Body>

            <h3 className="text-center mb-3">
              🔐 Forgot Password
            </h3>

            <p className="text-muted text-center">
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
                />

              </Form.Group>

              <Button
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Temporary Password"}
              </Button>

            </Form>

          </Card.Body>

        </Card>

      </motion.div>

    </Container>

  );
};

export default ForgotPassword;