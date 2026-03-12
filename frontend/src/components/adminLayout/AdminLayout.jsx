import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";

const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>

      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }}
      >

        {/* Navbar */}
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <div
          style={{
            padding: "20px",
            flex: 1,
            width: "100%",
            overflowX: "hidden"
          }}
        >
          <Outlet />
        </div>

        {/* Footer */}
        <AdminFooter />

      </div>
    </div>
  );
};

export default AdminLayout;