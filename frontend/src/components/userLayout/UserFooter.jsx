import React from "react";
import { Container } from "react-bootstrap";

const UserFooter = () => {
  return (
    <div style={{ background: "#212529", color: "white", padding: "10px", marginTop: "40px" }}>
      <Container className="text-center">
        © {new Date().getFullYear()} CivicGuard | Emergency Alert System
      </Container>
    </div>
  );
};

export default UserFooter;