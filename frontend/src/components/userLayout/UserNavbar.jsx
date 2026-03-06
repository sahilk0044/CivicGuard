import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const UserNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>CivicGuard</Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="ms-auto">

            <Nav.Link as={NavLink} to="/user/dashboard">
              Dashboard
            </Nav.Link>

            <Nav.Link as={NavLink} to="/user/emergency">
              Emergency Alert
            </Nav.Link>

            <Nav.Link as={NavLink} to="/user/contacts">
              Contacts
            </Nav.Link>

            <Nav.Link as={NavLink} to="/user/alerts">
              My Alerts
            </Nav.Link>

            <Nav.Link as={NavLink} to="/user/profile">
              Profile
            </Nav.Link>

            <Nav.Link as={NavLink} to="/user/support">
              Support
            </Nav.Link>

            <Nav.Link as={NavLink} to="/login">
              Logout
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;