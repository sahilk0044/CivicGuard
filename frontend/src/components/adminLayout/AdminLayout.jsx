import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        <AdminNavbar />

        <div style={{ padding: "30px", flex: 1 }}>
          <Outlet />
        </div>

        <AdminFooter />

      </div>
    </div>
  );
};

export default AdminLayout;