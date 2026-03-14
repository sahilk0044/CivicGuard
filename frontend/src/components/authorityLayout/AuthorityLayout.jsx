import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AuthorityNavbar from "./AuthorityNavbar";
import AuthoritySidebar from "./AuthoritySidebar";
import AuthorityFooter from "./AuthorityFooter";


const AuthorityLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="authority-layout">

      <AuthorityNavbar setSidebarOpen={setSidebarOpen} />

      <div className="authority-body">

        <AuthoritySidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="authority-content">
          <Outlet />
          <AuthorityFooter />
        </main>

      </div>

      <style>{`

      .authority-layout{
        min-height:100vh;
        display:flex;
        flex-direction:column;
        background:#0f172a;
        color:white;
      }

      .authority-body{
        display:flex;
        flex:1;
      }

      .authority-content{
        flex:1;
        padding:25px;
      }

      `}</style>

    </div>

  );

};

export default AuthorityLayout;