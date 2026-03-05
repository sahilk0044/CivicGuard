import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <style>{`

      .hero{
        background:linear-gradient(135deg,#8b0000,#ff0000);
        color:white;
        padding:150px 0 110px;
        text-align:center;
      }

      .hero-title{
        font-size:48px;
        font-weight:700;
      }

      .hero-text{
        font-size:18px;
        margin:20px auto;
        max-width:650px;
      }

      .cta-btn{
        padding:12px 30px;
        border-radius:30px;
        font-size:18px;
        background:white;
        color:#8b0000;
        border:none;
        transition:0.3s;
      }

      .cta-btn:hover{
        background:#ffd700;
        color:black;
        transform:scale(1.05);
      }

      .section{
        padding:80px 0;
      }

      .feature-card{
        border:none;
        border-radius:15px;
        padding:30px;
        text-align:center;
        transition:0.3s;
      }

      .feature-card:hover{
        transform:translateY(-10px);
        box-shadow:0 10px 30px rgba(0,0,0,0.15);
      }

      .feature-icon{
        font-size:40px;
        margin-bottom:10px;
      }

      `}</style>

      {/* HERO */}

      <section className="hero">
        <Container>

          <h1 className="hero-title" data-aos="fade-down">
            CivicGuard Emergency Alert System
          </h1>

          <p className="hero-text" data-aos="fade-up">
            CivicGuard is designed to protect individuals by sending instant
            emergency alerts with location and video evidence to trusted
            contacts and authorities.
          </p>

          <Button
            as={NavLink}
            to="/register"
            className="cta-btn"
            data-aos="zoom-in"
          >
            Get Started
          </Button>

        </Container>
      </section>

      {/* FEATURES */}

      <section className="section">

        <Container>

          <Row className="text-center mb-5">
            <h2 data-aos="fade-up">Key Features</h2>
          </Row>

          <Row>

            <Col md={4} data-aos="zoom-in">

              <Card className="feature-card">

                <div className="feature-icon">🚨</div>

                <h5>Instant Emergency Alerts</h5>

                <p>
                  Send emergency alerts instantly to family members and
                  authorities during dangerous situations.
                </p>

              </Card>

            </Col>

            <Col md={4} data-aos="zoom-in" data-aos-delay="200">

              <Card className="feature-card">

                <div className="feature-icon">📍</div>

                <h5>Live Location Tracking</h5>

                <p>
                  GPS technology allows real-time location tracking to help
                  responders reach you quickly.
                </p>

              </Card>

            </Col>

            <Col md={4} data-aos="zoom-in" data-aos-delay="400">

              <Card className="feature-card">

                <div className="feature-icon">🎥</div>

                <h5>Video Evidence</h5>

                <p>
                  Capture and store video evidence during emergencies to assist
                  authorities.
                </p>

              </Card>

            </Col>

          </Row>

        </Container>

      </section>

      {/* HOW IT WORKS */}

      <section className="section" style={{background:"#f9fafb"}}>

        <Container>

          <Row className="text-center mb-5">
            <h2 data-aos="fade-up">How CivicGuard Works</h2>
          </Row>

          <Row>

            <Col md={4} data-aos="fade-up">

              <h4>1️⃣ Press Emergency Button</h4>
              <p>
                When you feel unsafe, press the emergency button to trigger the alert.
              </p>

            </Col>

            <Col md={4} data-aos="fade-up" data-aos-delay="200">

              <h4>2️⃣ Capture Location & Video</h4>
              <p>
                The system records GPS location and video evidence automatically.
              </p>

            </Col>

            <Col md={4} data-aos="fade-up" data-aos-delay="400">

              <h4>3️⃣ Alert Sent</h4>
              <p>
                Emergency contacts and authorities receive alerts instantly.
              </p>

            </Col>

          </Row>

        </Container>

      </section>

    </>
  );
};

export default Home;