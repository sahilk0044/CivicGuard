import { Route, Routes } from "react-router-dom";
import GuestLayout from "./components/guestLayout/GuestLayout";
import Home from "./components/guestLayout/Home";
import About from "./components/guestLayout/About";
import Features from "./components/guestLayout/Features";
import Contact from "./components/guestLayout/Contact";
import Register from "./components/guestLayout/Register";
import Login from "./components/guestLayout/Login";
import UserLayout from "./components/userLayout/UserLayout";
import Dashboard from "./components/userLayout/Dashboard";
import Contacts from "./components/userLayout/Contacts";
import Profile from "./components/userLayout/Profile";
import Support from "./components/userLayout/Support";
import EmergencyAlert from "./components/userLayout/EmergencyAlert";
import MyAlerts from "./components/userLayout/MyAlerts";
import AdminLayout from "./components/adminLayout/AdminLayout";
import AdminDashboard from "./components/adminLayout/AdminDashboard";
import ManageUsers from "./components/adminLayout/ManageUsers";
import ManageAuthorities from "./components/adminLayout/ManageAuthorities";
import ManageAlerts from "./components/adminLayout/ManageAlerts";
import Reports from "./components/adminLayout/Reports";
import axios from "axios";
import { useEffect } from "react";
import Settings from "./components/adminLayout/Settings";
import AuthorityLayout from "./components/authorityLayout/AuthorityLayout";
import AuthorityDashboard from "./components/authorityLayout/AuthorityDashboard";
import AuthorityAlerts from "./components/authorityLayout/AuthorityAlerts";
import AuthorityProfile from "./components/authorityLayout/AuthorityProfile";
import AuthorityLogin from "./components/authorityLayout/AuthorityLogin";


function App() {
  useEffect(() => {

    const verifyToken = async () => {

      const token = localStorage.getItem("token");

      if (!token) return;

      try {

        await axios.get(
          "http://localhost:8000/api/users/verify-token",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("User already authenticated");

      } catch (error) {

        console.log("Token invalid");

        localStorage.removeItem("token");

      }

    };

    verifyToken();

  }, []);
  return (
  <Routes>
    <Route path="/" element={<GuestLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="features" element={<Features/>}/>
      <Route path="contact" element={<Contact/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="/authority/login" element={<AuthorityLogin />} />
    </Route>

    <Route path="/user" element={<UserLayout/>}>
      <Route index element={<Dashboard/>}/>
      <Route path="/user/dashboard" element={<Dashboard/>}/>
      <Route path="/user/contacts" element={<Contacts/>}/>
      <Route path="/user/profile" element={<Profile/>}/>
      <Route path="/user/support" element={<Support/>}/>
      <Route path="/user/emergency" element={<EmergencyAlert/>}/>
      <Route path="/user/alerts" element={<MyAlerts/>}/>
    </Route>

    <Route path="/admin" element={<AdminLayout/>}>
    <Route index element={<AdminDashboard/>}/>
    <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
    <Route path="/admin/users" element={<ManageUsers/>}/>
    <Route path="/admin/authorities" element={<ManageAuthorities/>}/>
    <Route path="/admin/alerts" element={<ManageAlerts/>}/>
    <Route path="/admin/reports" element={<Reports />} />
    <Route path="/admin/settings" element={<Settings />} />
    
    </Route>

    <Route path="/authority" element={<AuthorityLayout/>}>
      <Route index element={<AuthorityDashboard/>}/>
      <Route path="/authority/dashboard" element={<AuthorityDashboard/>}/>
      <Route path="/authority/alerts" element={<AuthorityAlerts/>}/>
      <Route path="/authority/profile" element={<AuthorityProfile/>}/>
      
    </Route>


    </Routes>
  );
}

export default App;
