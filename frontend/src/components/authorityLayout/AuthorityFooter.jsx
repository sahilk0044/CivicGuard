import React from "react";

const AuthorityFooter = () => {
  return (
    <footer style={{
      marginTop:"40px",
      textAlign:"center",
      opacity:"0.6",
      fontSize:"14px"
    }}>
      © {new Date().getFullYear()} CivicGuard Authority Panel
    </footer>
  );
};

export default AuthorityFooter;