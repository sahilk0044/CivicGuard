import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";
import { MdLocationOn } from "react-icons/md";

const About = () => {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
      <style>{`

      /* HERO */

      .about-hero{
        background: linear-gradient(135deg,#8b0000,#ff0000);
        color:white;
        padding:130px 0 100px;
        text-align:center;
      }

      .about-title{
        font-size:48px;
        font-weight:700;
        margin-bottom:10px;
      }

      .about-sub{
        font-size:18px;
        opacity:0.9;
      }

      /* SECTION */

      .about-section{
        padding:90px 0;
      }

      .highlight{
        color:#ff0000;
        font-weight:600;
      }

      /* CARDS */

      .about-card{
        border:none;
        border-radius:18px;
        padding:35px;
        transition:0.3s;
        background:white;
      }

      .about-card:hover{
        transform:translateY(-8px);
        box-shadow:0 12px 30px rgba(0,0,0,0.15);
      }

      /* TECHNOLOGY */

      .tech-card{
        text-align:center;
        border:none;
        padding:30px;
        border-radius:18px;
        transition:0.3s;
      }

      .tech-card:hover{
        transform:translateY(-8px);
        box-shadow:0 12px 25px rgba(0,0,0,0.15);
      }

      .tech-icon{
        font-size:42px;
        margin-bottom:10px;
        color:#ff0000;
      }

      `}</style>

      {/* HERO */}

      <section className="about-hero">

        <Container>

          <h1 className="about-title" data-aos="fade-down">
            About CivicGuard
          </h1>

          <p className="about-sub" data-aos="fade-up">
            A smart emergency alert system built to improve personal safety
            using modern web technologies.
          </p>

        </Container>

      </section>

      {/* INTRO */}

      <section className="about-section">

        <Container>

          <Row>

            <Col md={12} data-aos="fade-up">

              <h2>What is CivicGuard?</h2>

              <p>
                <span className="highlight">CivicGuard</span> is a safety-focused
                emergency alert platform designed to help individuals quickly
                notify trusted contacts and authorities during dangerous
                situations.
              </p>

              <p>
                When a user presses the emergency button, the system
                automatically sends alerts containing their
                <span className="highlight"> GPS location, video evidence,
                and contact details</span>.
              </p>

              <p>
                This ensures faster response from emergency services and helps
                improve overall personal security.
              </p>

            </Col>

          </Row>

        </Container>

      </section>

      {/* MISSION VISION */}

      <section className="about-section" style={{background:"#f9fafb"}}>

        <Container>

          <Row>

            <Col md={6} data-aos="fade-right">

              <Card className="about-card">

                <h4>🎯 Our Mission</h4>

                <p>
                  Our mission is to empower individuals with a reliable
                  emergency alert system that enables them to quickly request
                  help and share critical information during emergencies.
                </p>

              </Card>

            </Col>

            <Col md={6} data-aos="fade-left">

              <Card className="about-card">

                <h4>🌍 Our Vision</h4>

                <p>
                  We envision a world where technology enhances personal safety
                  and ensures rapid response by connecting people, emergency
                  services, and authorities instantly.
                </p>

              </Card>

            </Col>

          </Row>

        </Container>

      </section>

      {/* TECHNOLOGY */}

      <section className="about-section">

        <Container>

          <Row className="text-center mb-5">

            <h2 data-aos="fade-up">
              Technologies Used
            </h2>

            <p data-aos="fade-up">
              CivicGuard is built using modern full-stack web technologies.
            </p>

          </Row>

          <Row>

            <Col md={3} data-aos="zoom-in">

              <Card className="tech-card">

                <FaReact className="tech-icon"/>

                <h5>React</h5>

                <p>
                  Used to build the responsive and interactive frontend
                  interface.
                </p>

              </Card>

            </Col>

            <Col md={3} data-aos="zoom-in" data-aos-delay="200">

              <Card className="tech-card">

                <FaNodeJs className="tech-icon"/>

                <h5>Node.js</h5>

                <p>
                  Handles the backend server and emergency alert APIs.
                </p>

              </Card>

            </Col>

            <Col md={3} data-aos="zoom-in" data-aos-delay="400">

              <Card className="tech-card">

                <SiMongodb className="tech-icon"/>

                <h5>MongoDB</h5>

                <p>
                  Stores user data, alerts, and emergency contacts.
                </p>

              </Card>

            </Col>

            <Col md={3} data-aos="zoom-in" data-aos-delay="600">

              <Card className="tech-card">

                <MdLocationOn className="tech-icon"/>

                <h5>GPS Tracking</h5>

                <p>
                  Shares real-time location with emergency contacts.
                </p>

              </Card>

            </Col>

          </Row>

        </Container>

      </section>

    </>
  );
};

export default About;