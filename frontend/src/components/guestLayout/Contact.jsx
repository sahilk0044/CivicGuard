import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {

  const [message,setMessage] = useState("");
  const [type,setType] = useState("");

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    message:""
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:8000/api/users/contact",
        formData
      );

      setMessage("Message sent successfully!");
      setType("success");

      setFormData({
        name:"",
        email:"",
        message:""
      });

    } catch (err) {

      setMessage("Failed to send message");
      setType("error");

    }

  };

  return (
    <>
      <style>{`

      .contact-hero{
        background:linear-gradient(135deg,#8b0000,#ff0000);
        color:white;
        padding:130px 0 100px;
        text-align:center;
      }

      .contact-title{
        font-size:48px;
        font-weight:700;
      }

      .contact-sub{
        font-size:18px;
        opacity:0.9;
      }

      .contact-section{
        padding:90px 0;
      }

      .contact-form{
        background:white;
        padding:35px;
        border-radius:18px;
        box-shadow:0 10px 30px rgba(0,0,0,0.1);
      }

      .contact-btn{
        background:#ff0000;
        border:none;
        padding:10px 25px;
        transition:0.3s;
      }

      .contact-btn:hover{
        background:#b30000;
        transform:scale(1.05);
      }

      /* MESSAGE BOX */

      .message-box{
        padding:10px;
        border-radius:8px;
        margin-bottom:15px;
        font-size:14px;
      }

      .success{
        background:#d4edda;
        color:#155724;
      }

      .error{
        background:#f8d7da;
        color:#721c24;
      }

      .info-card{
        border:none;
        padding:30px;
        border-radius:18px;
        text-align:center;
        transition:0.3s;
      }

      .info-card:hover{
        transform:translateY(-8px);
        box-shadow:0 10px 25px rgba(0,0,0,0.15);
      }

      .info-icon{
        font-size:35px;
        margin-bottom:10px;
        color:#ff0000;
      }

      `}</style>

      {/* HERO */}

      <section className="contact-hero">

        <Container>

          <h1 className="contact-title" data-aos="fade-down">
            Contact CivicGuard
          </h1>

          <p className="contact-sub" data-aos="fade-up">
            Reach out to us for support, safety guidance, or project inquiries.
          </p>

        </Container>

      </section>

      {/* CONTACT SECTION */}

      <section className="contact-section">

        <Container>

          <Row>

            {/* CONTACT FORM */}

            <Col md={6} data-aos="fade-right">

              <div className="contact-form">

                <h4 className="mb-4">Send us a message</h4>

                <Form onSubmit={handleSubmit}>

                  {/* MESSAGE ABOVE FIRST FIELD */}

                  {message && (
                    <div className={`message-box ${type}`}>
                      {message}
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={formData.message}
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button type="submit" className="contact-btn">
                    Send Message
                  </Button>

                </Form>

              </div>

            </Col>

            {/* CONTACT INFO */}

            <Col md={6}>

              <Row>

                <Col md={12} className="mb-4" data-aos="zoom-in">

                  <Card className="info-card">

                    <FaPhoneAlt className="info-icon"/>

                    <h5>Emergency Helpline</h5>

                    <p>Dial <strong>112</strong> for immediate assistance.</p>

                  </Card>

                </Col>

                <Col md={12} className="mb-4" data-aos="zoom-in" data-aos-delay="200">

                  <Card className="info-card">

                    <FaEnvelope className="info-icon"/>

                    <h5>Email Support</h5>

                    <p>civicguard.support@gmail.com</p>

                  </Card>

                </Col>

                <Col md={12} data-aos="zoom-in" data-aos-delay="400">

                  <Card className="info-card">

                    <FaMapMarkerAlt className="info-icon"/>

                    <h5>Location</h5>

                    <p>India Safety Technology Network</p>

                  </Card>

                </Col>

              </Row>

            </Col>

          </Row>

        </Container>

      </section>

    </>
  );
};

export default Contact;