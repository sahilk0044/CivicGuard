import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaShieldAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const UserFooter = () => {

  return (

    <>
    
    <style>
      {`

      .user-footer{
        background: linear-gradient(90deg,#0f172a,#1e3a8a);
        color:white;
        padding:25px 0;
        margin-top:50px;
        font-size:14px;
      }

      .footer-title{
        font-weight:600;
        margin-bottom:8px;
      }

      .footer-link{
        color:#cbd5f5;
        text-decoration:none;
        transition:0.3s;
      }

      .footer-link:hover{
        color:#38bdf8;
      }

      .footer-bottom{
        border-top:1px solid rgba(255,255,255,0.2);
        margin-top:15px;
        padding-top:10px;
        font-size:13px;
      }

      `}
    </style>

    <footer className="user-footer">

      <Container>

        <Row className="text-center text-md-start">

          <Col md={4} className="mb-3">

            <h6 className="footer-title">
              <FaShieldAlt className="me-2"/>
              CivicGuard
            </h6>

            <p>
              CivicGuard is an emergency alert platform designed
              to improve personal safety by instantly notifying
              trusted contacts and authorities.
            </p>

          </Col>

          <Col md={4} className="mb-3">

            <h6 className="footer-title">Quick Links</h6>

            <div>
              <a className="footer-link" href="/user/dashboard">Dashboard</a>
            </div>

            <div>
              <a className="footer-link" href="/user/alerts">My Alerts</a>
            </div>

            <div>
              <a className="footer-link" href="/user/profile">Profile</a>
            </div>

          </Col>

          <Col md={4} className="mb-3">

            <h6 className="footer-title">Support</h6>

            <div>
              <FaEnvelope className="me-2"/>
              support@civicguard.com
            </div>

            <div>
              <FaPhone className="me-2"/>
              Emergency: 112
            </div>

          </Col>

        </Row>

        <div className="text-center footer-bottom">

          © {new Date().getFullYear()} CivicGuard | Emergency Alert System

        </div>

      </Container>

    </footer>

    </>

  );

};

export default UserFooter;