import React from "react";
import { FaBars } from "react-icons/fa";

const AuthorityNavbar = ({ setSidebarOpen }) => {

  return (

    <nav className="authority-navbar">

      <div className="nav-left">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <FaBars />
        </button>

        <h4>CivicGuard Authority</h4>

      </div>

      <div>Authority Panel</div>

      <style>{`

      .authority-navbar{
        height:60px;
        background:#020617;
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:0 20px;
        border-bottom:1px solid rgba(255,255,255,0.08);
      }

      .menu-btn{
        background:none;
        border:none;
        color:white;
        font-size:20px;
        margin-right:10px;
      }

      .nav-left{
        display:flex;
        align-items:center;
      }

      `}</style>

    </nav>

  );

};

export default AuthorityNavbar;