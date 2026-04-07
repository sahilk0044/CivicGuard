import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaExclamationTriangle,
  FaUserShield,

  FaSignOutAlt,
  FaUser,
  FaSortAlphaUp,
  FaArchive,
  FaCode
} from "react-icons/fa";

const AuthoritySidebar = ({ sidebarOpen, setSidebarOpen }) => {

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (

    <aside className={`authority-sidebar ${sidebarOpen ? "open" : ""}`}>

      <NavLink to="/authority/dashboard" onClick={closeSidebar}>
        <FaHome /> Dashboard
      </NavLink>
      
      <NavLink to="/authority/profile" onClick={closeSidebar}>
        <FaUser/> Profile
      </NavLink>

      <NavLink to="/authority/alerts" onClick={closeSidebar}>
        <FaExclamationTriangle /> Alerts
      </NavLink>
      <NavLink to="/authority/changepassword" onClick={closeSidebar}>
        <FaCode /> Change Password
      </NavLink>

      

      <NavLink to="/authority/login" onClick={closeSidebar}>
        <FaSignOutAlt /> Logout
      </NavLink>

      <style>{`

      .authority-sidebar{
        width:220px;
        background:#020617;
        display:flex;
        flex-direction:column;
        gap:15px;
        padding:20px;
        transition:0.3s;
      }

      .authority-sidebar a{
        text-decoration:none;
        color:white;
        padding:10px;
        border-radius:8px;
        display:flex;
        gap:10px;
        align-items:center;
      }

      .authority-sidebar a:hover{
        background:#1e293b;
      }

      .authority-sidebar a.active{
        background:#2563eb;
      }

      .logout{
        margin-top:auto;
        color:#ef4444;
      }

      @media(max-width:768px){

        .authority-sidebar{
          position:fixed;
          left:-240px;
          top:60px;
          height:100%;
          z-index:1000;
        }

        .authority-sidebar.open{
          left:0;
        }

      }

      `}</style>

    </aside>

  );

};

export default AuthoritySidebar;