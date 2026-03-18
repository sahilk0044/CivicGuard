import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaExclamationTriangle,
  FaUsers,
  FaBell,
  FaShieldAlt
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmergencyMap from "../../components/maps/EmergencyMap";

import "./dashboard.css";

const Dashboard = () => {

  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [contacts, setContacts] = useState([]);   // FIXED
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("name") || "User";

  useEffect(() => {

    AOS.init({ duration: 1000 });

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      /* GET CONTACTS */

      const contactsRes = await axios.get(
        "http://localhost:8000/api/users/contacts",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setContacts(contactsRes.data);

      /* GET ALERTS */

      const alertsRes = await axios.get(
        "http://localhost:8000/api/alerts/my-alerts",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAlerts(alertsRes.data);

      setLoading(false);

    } catch (error) {

      console.log(error);
      setLoading(false);

    }

  };

  const activeAlerts = alerts.filter(a => a.status === "assigned");

  if (loading) {

    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  }

  return (
    <Container fluid className="p-4">

      {/* Welcome */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <Card className="shadow border-0 mb-4">

          <Card.Body>

            <h3>Welcome back, {userName} 👋</h3>

            <p className="text-muted">
              CivicGuard instantly alerts trusted contacts and authorities
              during emergencies and keeps you protected.
            </p>

          </Card.Body>

        </Card>

      </motion.div>

      {/* Emergency Alert */}

      <motion.div whileHover={{ scale: 1.03 }}>

        <Card
          className="shadow-lg border-0 text-center mb-4"
          style={{
            background: "linear-gradient(135deg,#ff4d4d,#ff0000)",
            color: "white"
          }}
        >

          <Card.Body>

            <FaExclamationTriangle size={45} />

            <h2 className="mt-3">Emergency Alert</h2>

            <p>
              If you feel unsafe press the button below.
              Your location and evidence will be sent immediately.
            </p>

            <Button
              size="lg"
              variant="light"
              onClick={() => navigate("/user/emergency")}
            >
              🚨 SEND ALERT
            </Button>

          </Card.Body>

        </Card>

      </motion.div>

      {/* Stats */}

      <Row className="mb-4">

        <Col md={3}>

          <Card className="shadow border-0 text-center dashboard-card">

            <Card.Body>

              <FaUsers size={28} className="text-primary mb-2" />

              <h6>Contacts</h6>

              <h3>{contacts.length}</h3>   {/* FIXED */}

            </Card.Body>

          </Card>

        </Col>

        <Col md={3}>

          <Card className="shadow border-0 text-center dashboard-card">

            <Card.Body>

              <FaBell size={28} className="text-danger mb-2" />

              <h6>Total Alerts</h6>

              <h3>{alerts.length}</h3>

            </Card.Body>

          </Card>

        </Col>

        <Col md={3}>

          <Card className="shadow border-0 text-center dashboard-card">

            <Card.Body>

              <FaExclamationTriangle size={28} className="text-warning mb-2" />

              <h6>Active Alerts</h6>

              <h3>{activeAlerts.length}</h3>

            </Card.Body>

          </Card>

        </Col>

        <Col md={3}>

          <Card className="shadow border-0 text-center dashboard-card">

            <Card.Body>

              <FaShieldAlt size={28} className="text-success mb-2" />

              <h6>Status</h6>

              <h3>{activeAlerts.length ? "ALERT" : "SAFE"}</h3>

            </Card.Body>

          </Card>

        </Col>

      </Row>

      {/* Map + Timeline */}

      <Row>

        {/* Map */}

        <Col md={8}>

          <Card className="shadow border-0 mb-4">

            <Card.Body>

              <h5 className="mb-3">Live Emergency Monitoring Map</h5>

              <div className="map-container">

                <EmergencyMap />

              </div>

            </Card.Body>

          </Card>

        </Col>

        {/* Timeline */}

        <Col md={4}>

          <Card className="shadow border-0">

            <Card.Body>

              <h5 className="mb-3">Alert Timeline</h5>

              {alerts.length === 0 && (
                <p className="text-muted">
                  No alerts triggered yet.
                </p>
              )}

              {alerts.slice(0,6).map(alert => (

                <div
                  key={alert._id}
                  className="alert-timeline"
                >

                  <strong>🚨 {alert.status.toUpperCase()}</strong>

                  <br/>

                  <small className="text-muted">

                    {new Date(alert.createdAt).toLocaleString()}

                  </small>

                </div>

              ))}

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>
  );
};

export default Dashboard;