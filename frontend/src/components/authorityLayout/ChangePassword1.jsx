import React from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from "react-bootstrap";

const API_BASE = "http://localhost:8000/api/authority";

export default class ChangePassword1 extends React.Component {
  state = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loading: false,
    error: "",
    success: "",
  };

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ error: "", success: "" });

    const { currentPassword, newPassword, confirmPassword } = this.state;

    if (!currentPassword || !newPassword) {
      return this.setState({ error: "Please fill all required fields." });
    }

    if (newPassword.length < 6) {
      return this.setState({ error: "New password should be at least 6 characters." });
    }

    if (newPassword !== confirmPassword) {
      return this.setState({ error: "New password and confirmation do not match." });
    }

    this.setState({ loading: true });

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return this.setState({ error: "You are not logged in. Please login again." });
      }

      const payload = {
        oldPassword: currentPassword,
        newPassword,
      };

      const res = await axios.post(
        `${API_BASE}/change-password`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.setState({
        success: res.data?.message || "Password changed successfully.",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to change password. Try again.";
      this.setState({ error: msg });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { currentPassword, newPassword, confirmPassword, loading, error, success } = this.state;

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #141E30, #243B55)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>

              <Card
                style={{
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                }}
              >
                <Card.Body style={{ padding: "35px" }}>

                  <h3 className="text-center mb-4" style={{ fontWeight: "600" }}>
                    🛡️ Authority Password Update
                  </h3>

                  {success && <Alert variant="success">{success}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={this.handleSubmit}>

                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        name="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={this.handleChange}
                        required
                        style={{
                          borderRadius: "12px",
                          padding: "12px",
                        }}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            name="newPassword"
                            type="password"
                            placeholder="Minimum 6 characters"
                            value={newPassword}
                            onChange={this.handleChange}
                            required
                            style={{
                              borderRadius: "12px",
                              padding: "12px",
                            }}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={this.handleChange}
                            required
                            style={{
                              borderRadius: "12px",
                              padding: "12px",
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid mt-3">
                      <Button
                        type="submit"
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
                            <Spinner size="sm" /> Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>

                  </Form>

                </Card.Body>
              </Card>

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}