import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const UserNavbar = () => {

  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => {
    setExpanded(false); // close menu on mobile
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>

        <Navbar.Brand
          as={NavLink}
          to="/user/dashboard"
          onClick={handleNavClick}
        >
          CivicGuard
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="user-navbar-nav" />

        <Navbar.Collapse id="user-navbar-nav">

          <Nav className="ms-auto">

            <Nav.Link
              as={NavLink}
              to="/user/dashboard"
              onClick={handleNavClick}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/user/emergency"
              onClick={handleNavClick}
            >
              Emergency Alert
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/user/contacts"
              onClick={handleNavClick}
            >
              Contacts
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/user/alerts"
              onClick={handleNavClick}
            >
              My Alerts
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/user/profile"
              onClick={handleNavClick}
            >
              Profile
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/user/support"
              onClick={handleNavClick}
            >
              Support
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/user/changepassword"
              onClick={handleNavClick}
            >
              change password
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/login"
              onClick={handleNavClick}
            >
              Logout
            </Nav.Link>

          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;