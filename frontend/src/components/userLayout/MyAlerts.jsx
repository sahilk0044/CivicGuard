import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import EmergencyMap from "../../components/maps/EmergencyMap";

const MyAlerts = () => {

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    fetchMyAlerts();
  }, []);

  const fetchMyAlerts = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/alerts/my-alerts",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAlerts(res.data);
      setLoading(false);

    } catch (error) {

      console.log("Error fetching alerts:", error);
      setLoading(false);

    }

  };

  const getStatusBadge = (status) => {

    if (status === "resolved") return <Badge bg="success">Resolved</Badge>;

    if (status === "in-progress")
      return <Badge bg="warning">In Progress</Badge>;

    return <Badge bg="danger">Active</Badge>;

  };

  return (

    <Container className="mt-4">

      <h2 className="text-center mb-4">My Alerts</h2>

      {loading ? (

        <div className="text-center">
          <Spinner animation="border" />
        </div>

      ) : alerts.length === 0 ? (

        <p className="text-center text-muted">
          No alerts generated yet
        </p>

      ) : (

        <Row>

          {alerts.map((alert) => (

            <Col md={4} key={alert._id} className="mb-4">

              <Card className="shadow-sm h-100">

                {alert.video && (

                  <video
                    width="100%"
                    height="200"
                    controls
                    style={{ objectFit: "cover" }}
                  >
                    <source
                      src={`http://localhost:8000/${alert.video}`}
                      type="video/webm"
                    />
                  </video>

                )}

                <Card.Body>

                  <Card.Title>
                    Alert #{alert._id.slice(-5)}
                  </Card.Title>

                  <p>
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(alert.status)}
                  </p>
                  <p>
                    <strong>Assigned Authority:</strong>{" "}
                    {alert.authority ? (
                      <>
                        {alert.authority.name} ({alert.authority.department})
                      </>
                    ) : (
                      "Not Assigned Yet"
                    )}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>

                  {alert.latitude && alert.longitude ? (

                    <div className="d-flex gap-2">


                      <Button
                        size="sm"
                        variant="outline-secondary"
                        href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                        target="_blank"
                      >
                        Google Maps
                      </Button>

                    </div>

                  ) : (

                    <p className="text-muted">
                      Location Unknown
                    </p>

                  )}

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>

      )}

      {selectedAlert && (

        <div className="mt-5">

          <h4 className="text-center mb-3">
            Alert Location
          </h4>

          <EmergencyMap
            key={selectedAlert._id}
            selectedAlert={selectedAlert}
          />

        </div>

      )}

    </Container>

  );

};

export default MyAlerts;