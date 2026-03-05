import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  FaBell,
  FaMapMarkerAlt,
  FaVideo,
  FaEnvelope,
  FaUserShield,
  FaChartBar
} from "react-icons/fa";

const Features = () => {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const features = [
    {
      icon: <FaBell />,
      title: "Instant Emergency Alert",
      desc: "Users can trigger an emergency alert with a single click. The system instantly notifies emergency contacts and authorities.",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Live Location Tracking",
      desc: "GPS technology sends real-time location coordinates so responders can quickly locate the user.",
    },
    {
      icon: <FaVideo />,
      title: "Video Evidence Recording",
      desc: "During emergencies the system captures video evidence which can help authorities understand the situation.",
    },
    {
      icon: <FaEnvelope />,
      title: "Automatic Email Alerts",
      desc: "Emergency notifications are automatically sent to trusted contacts and authorities via email.",
    },
    {
      icon: <FaUserShield />,
      title: "Authority Monitoring",
      desc: "Authorities can view alerts, track user location, and resolve emergency situations through their dashboard.",
    },
    {
      icon: <FaChartBar />,
      title: "Admin Dashboard",
      desc: "Admins can monitor users, manage alerts, and track system activity through a centralized control panel.",
    },
  ];

  return (
    <>
      <style>{`

      /* HERO */

      .features-hero{
        background:linear-gradient(135deg,#8b0000,#ff0000);
        color:white;
        padding:130px 0 100px;
        text-align:center;
      }

      .features-title{
        font-size:48px;
        font-weight:700;
      }

      .features-sub{
        font-size:18px;
        opacity:0.9;
      }

      /* SECTION */

      .features-section{
        padding:90px 0;
      }

      /* CARD */

      .feature-card{
        border:none;
        border-radius:18px;
        padding:35px;
        text-align:center;
        transition:0.3s;
        background:white;
        height:100%;
      }

      .feature-card:hover{
        transform:translateY(-10px);
        box-shadow:0 12px 30px rgba(0,0,0,0.15);
      }

      .feature-icon{
        font-size:40px;
        margin-bottom:15px;
        color:#ff0000;
      }

      .feature-title{
        font-weight:600;
        margin-bottom:10px;
      }

      `}</style>

      {/* HERO */}

      <section className="features-hero">

        <Container>

          <h1 className="features-title" data-aos="fade-down">
            CivicGuard Features
          </h1>

          <p className="features-sub" data-aos="fade-up">
            Powerful tools designed to provide safety and rapid emergency response.
          </p>

        </Container>

      </section>

      {/* FEATURES */}

      <section className="features-section">

        <Container>

          <Row className="text-center mb-5">

            <h2 data-aos="fade-up">
              Key System Capabilities
            </h2>

            <p data-aos="fade-up">
              CivicGuard combines multiple technologies to ensure fast and reliable emergency assistance.
            </p>

          </Row>

          <Row>

            {features.map((feature, index) => (

              <Col md={4} className="mb-4" key={index} data-aos="zoom-in">

                <Card className="feature-card">

                  <div className="feature-icon">
                    {feature.icon}
                  </div>

                  <h5 className="feature-title">
                    {feature.title}
                  </h5>

                  <p>
                    {feature.desc}
                  </p>

                </Card>

              </Col>

            ))}

          </Row>

        </Container>

      </section>

    </>
  );
};

export default Features;