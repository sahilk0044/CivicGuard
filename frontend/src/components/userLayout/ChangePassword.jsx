import React from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from "react-bootstrap";

const API_BASE = "http://localhost:8000/api/users";

export default class ChangePassword extends React.Component {
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

    // Get email from localStorage
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const email = parsedUser?.email;

    if (!email) {
      return this.setState({ error: "Could not determine your email. Please sign in and try again." });
    }
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
      const payload = { email, currentPassword, newPassword };
      const res = await axios.post(`${API_BASE}/change-password`, payload);
      this.setState({
        success: res.data?.message || "Password changed successfully.",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to change password. Try again.";
      this.setState({ error: msg });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { currentPassword, newPassword, confirmPassword, loading, error, success } = this.state;

    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={9} lg={7}>
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="mb-3 text-center">Change Password</h4>
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group controlId="cpCurrent" className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      name="currentPassword"
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Row>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group controlId="cpNew">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          name="newPassword"
                          type="password"
                          placeholder="New password (min 6 chars)"
                          value={newPassword}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Group controlId="cpConfirm">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={this.handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-grid">
                    <Button variant="success" type="submit" disabled={loading}>
                      {loading ? <><Spinner size="sm" /> Updating...</> : "Change Password"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}