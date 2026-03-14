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

      .login-card{
        border:none;
        border-radius:15px;
        padding:30px;
        text-align:center;
        transition:0.3s;
        background:white;
      }

      .login-card:hover{
        transform:translateY(-8px);
        box-shadow:0 10px 25px rgba(0,0,0,0.15);
      }

      `}</style>

      {/* HERO */}

      <section className="hero">
        <Container>

          <h1 className="hero-title" data-aos="fade-down">
            CivicGuard Emergency Alert System
          </h1>

          <p className="hero-text" data-aos="fade-up">
            Your safety should never depend on luck. CivicGuard empowers users
            to quickly alert trusted contacts and authorities during emergency
            situations using modern technology.
          </p>

          <Button
            as={NavLink}
            to="/register"
            className="cta-btn"
            data-aos="zoom-in"
          >
            Join CivicGuard Today
          </Button>

        </Container>
      </section>

      {/* LOGIN OPTIONS */}

      <section className="section" style={{background:"#f9fafb"}}>

        <Container>

          <Row className="text-center mb-5">
            <h2 data-aos="fade-up">Access the System</h2>
            <p data-aos="fade-up">Login according to your role</p>
          </Row>

          <Row>

            <Col md={4} data-aos="zoom-in">

              <Card className="login-card">

                <h4>👤 User</h4>

                <p>
                  Citizens can register and send emergency alerts using the
                  CivicGuard system.
                </p>

                <Button
                  as={NavLink}
                  to="/login"
                  variant="primary"
                >
                  User Login
                </Button>

              </Card>

            </Col>

            <Col md={4} data-aos="zoom-in" data-aos-delay="200">

              <Card className="login-card">

                <h4>🛡 Authority</h4>

                <p>
                  Authorities receive emergency alerts and respond quickly to
                  help citizens in danger.
                </p>

                <Button
                  as={NavLink}
                  to="/authority/login"
                  variant="warning"
                >
                  Authority Login
                </Button>

              </Card>

            </Col>

            <Col md={4} data-aos="zoom-in" data-aos-delay="400">

              <Card className="login-card">

                <h4>⚙ Admin</h4>

                <p>
                  Administrators manage the CivicGuard system including users
                  and authorities.
                </p>

                <Button
                  as={NavLink}
                  to="/admin/login"
                  variant="dark"
                >
                  Admin Login
                </Button>

              </Card>

            </Col>

          </Row>

        </Container>

      </section>

      {/* WHY CIVICGUARD */}

      <section className="section">

        <Container>

          <Row className="text-center mb-5">
            <h2 data-aos="fade-up">Why CivicGuard?</h2>
          </Row>

          <Row>

            <Col md={4} data-aos="zoom-in">

              <Card className="feature-card">

                <div className="feature-icon">🛡</div>

                <h5>Personal Safety</h5>

                <p>
                  CivicGuard focuses on protecting individuals by providing a
                  reliable platform to request help during dangerous situations.
                </p>

              </Card>

            </Col>

            <Col md={4} data-aos="zoom-in" data-aos-delay="200">

              <Card className="feature-card">

                <div className="feature-icon">⚡</div>

                <h5>Fast Emergency Response</h5>

                <p>
                  The system ensures that alerts reach the right people quickly
                  so help can arrive without delay.
                </p>

              </Card>

            </Col>

            <Col md={4} data-aos="zoom-in" data-aos-delay="400">

              <Card className="feature-card">

                <div className="feature-icon">🌐</div>

                <h5>Technology for Safety</h5>

                <p>
                  CivicGuard uses modern web technologies to build a smarter
                  and more connected safety ecosystem.
                </p>

              </Card>

            </Col>

          </Row>

        </Container>

      </section>

      {/* OUR MISSION */}

      <section className="section" style={{background:"#f9fafb"}}>

        <Container>

          <Row className="text-center mb-5">
            <h2 data-aos="fade-up">Our Mission</h2>
          </Row>

          <Row>

            <Col md={12} data-aos="fade-up">

              <p style={{fontSize:"18px",maxWidth:"800px",margin:"auto"}}>
                Our mission is to create a safer environment by connecting
                people, technology, and emergency services. CivicGuard helps
                individuals quickly notify trusted contacts and authorities
                during critical situations, improving response time and
                potentially saving lives.
              </p>

            </Col>

          </Row>

        </Container>

      </section>

      {/* CALL TO ACTION */}

      <section className="section">

        <Container className="text-center">

          <h2 data-aos="fade-up">
            Safety Starts With Awareness
          </h2>

          <p data-aos="fade-up" style={{maxWidth:"600px",margin:"auto"}}>
            Join CivicGuard and take a step towards a smarter emergency
            response system. Your safety and your loved ones' safety matter.
          </p>

          <Button
            as={NavLink}
            to="/register"
            className="cta-btn"
            data-aos="zoom-in"
            style={{marginTop:"20px"}}
          >
            Create Your Account
          </Button>

        </Container>

      </section>

    </>
  );
};

export default Home;