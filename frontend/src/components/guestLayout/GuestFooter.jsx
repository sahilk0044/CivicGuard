import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const GuestFooter = () => {
  return (
    <>
      <style>{`

      .footer{
        background:#111827;
        color:white;
        padding:60px 0 30px;
      }

      .footer-brand{
        font-size:22px;
        font-weight:700;
        margin-bottom:10px;
      }

      .footer-desc{
        opacity:0.8;
        font-size:14px;
      }

      .footer-links a{
        display:block;
        color:#d1d5db;
        text-decoration:none;
        margin-bottom:8px;
        transition:0.3s;
      }

      .footer-links a:hover{
        color:#ff0000;
        transform:translateX(5px);
      }

      .footer-title{
        font-weight:600;
        margin-bottom:15px;
      }

      .footer-social{
        display:flex;
        gap:12px;
        margin-top:10px;
      }

      .social-icon{
        width:35px;
        height:35px;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#1f2937;
        border-radius:50%;
        transition:0.3s;
      }

      .social-icon:hover{
        background:#ff0000;
        transform:scale(1.1);
      }

      .footer-bottom{
        border-top:1px solid #374151;
        margin-top:40px;
        padding-top:15px;
        text-align:center;
        font-size:14px;
        opacity:0.8;
      }

      `}</style>

      <footer className="footer">
        <Container>
          <Row>

            {/* BRAND */}
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="footer-brand">CivicGuard</div>

                <p className="footer-desc">
                  CivicGuard is a smart emergency alert system designed to
                  protect individuals by instantly sharing location, video
                  evidence, and alerts with trusted contacts and authorities.
                </p>
              </motion.div>
            </Col>

            {/* QUICK LINKS */}
            <Col md={4}>
              <motion.div
                className="footer-links"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="footer-title">Quick Links</div>

                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/features">Features</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <NavLink to="/register">Register</NavLink>
              </motion.div>
            </Col>

            {/* CONTACT */}
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <div className="footer-title">Emergency Help</div>

                <p>📞 Emergency: 112</p>
                <p>✉ civicguard.help@gmail.com</p>
                <p>📍 India Safety Network</p>

                <div className="footer-social">
                  <div className="social-icon">f</div>
                  <div className="social-icon">t</div>
                  <div className="social-icon">in</div>
                </div>
              </motion.div>
            </Col>

          </Row>

          {/* COPYRIGHT */}

          <div className="footer-bottom">
            © {new Date().getFullYear()} CivicGuard Emergency Alert System. All Rights Reserved.
          </div>

        </Container>
      </footer>
    </>
  );
};

export default GuestFooter;