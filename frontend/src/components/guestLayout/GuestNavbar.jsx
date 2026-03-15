import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const GuestNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // CLOSE NAVBAR ON MOBILE AFTER CLICK
  const handleNavClick = () => {
    const navbar = document.getElementById("responsive-navbar-nav");

    if (navbar && navbar.classList.contains("show")) {
      navbar.classList.remove("show");
    }
  };

  return (
    <>
      <style>
        {`

        .custom-navbar {
          transition: all 0.3s ease;
          padding: 14px 0;
          background: ${
            scrolled
              ? "rgba(20,20,20,0.95)"
              : "linear-gradient(135deg,#8b0000,#ff0000)"
          };
          backdrop-filter: blur(10px);
        }

        .navbar-shadow {
          box-shadow: 0 6px 20px rgba(0,0,0,0.35);
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-logo {
          width: 40px;
          border-radius: 50%;
          transition: 0.3s ease;
        }

        .brand-logo:hover {
          transform: scale(1.1) rotate(8deg);
        }

        .brand-text {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .brand-civic {
          color: #ffffff;
        }

        .brand-guard {
          color: #ffd700;
        }

        .nav-link-custom {
          font-size: 16px;
          font-weight: 500;
          margin-left: 18px;
          position: relative;
          transition: 0.3s ease;
          color:white;
        }

        .nav-link-custom::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 0%;
          height: 2px;
          background: #ffd700;
          transition: 0.3s ease;
        }
        

        .nav-link-custom:hover::after {
          width: 100%;
        }

        .nav-link-custom:hover {
          color: #ffffff !important;
        }

        .nav-link-custom.active {
          color: #ffd700 !important;
        }

        .nav-link-custom.active::after {
          width: 100%;
        }

        @media (max-width: 992px) {

          .nav-link-custom {
            margin-left: 0;
            margin-top: 10px;
          }

        }

        `}
      </style>

      <Navbar
        expand="lg"
        variant="dark"
        fixed="top"
        className={`custom-navbar ${scrolled ? "navbar-shadow" : ""}`}
      >
        <Container>

          {/* BRAND */}

          <Navbar.Brand
            as={NavLink}
            to="/"
            className="brand-container"
            onClick={handleNavClick}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
              alt="CivicGuard"
              className="brand-logo"
            />

            <span className="brand-text">
              <span className="brand-civic">Civic</span>
              <span className="brand-guard">Guard</span>
            </span>
          </Navbar.Brand>

          {/* MOBILE TOGGLE */}

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          {/* NAV LINKS */}

          <Navbar.Collapse id="responsive-navbar-nav">

            <Nav className="ms-auto">

              <Nav.Link
                as={NavLink}
                to="/home"
                onClick={handleNavClick}
                className="nav-link-custom"
              >
                Home
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/about"
                onClick={handleNavClick}
                className="nav-link-custom"
              >
                About
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/features"
                onClick={handleNavClick}
                className="nav-link-custom"
              >
                Features
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/contact"
                onClick={handleNavClick}
                className="nav-link-custom"
              >
                Contact
              </Nav.Link>

              <Nav.Link
                as={NavLink}
                to="/register"
                onClick={handleNavClick}
                className="nav-link-custom"
              >
                Register
              </Nav.Link>
            
           
            </Nav>
              <NavDropdown title="Login"  className="nav-link-custom">

          <NavDropdown.Item as={NavLink} to="/login">
            👤 Login as User
          </NavDropdown.Item>

          <NavDropdown.Item as={NavLink} to="/authority/login">
            🛡 Login as Authority
          </NavDropdown.Item>

          <NavDropdown.Item as={NavLink} to="/admin/login">
            ⚙ Login as Admin
          </NavDropdown.Item>

        </NavDropdown>

          </Navbar.Collapse>

        </Container>
      </Navbar>
    </>
  );
};

export default GuestNavbar;