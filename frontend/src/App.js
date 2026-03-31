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
import AuthorityLogin from "./components/authorityLayout/AuthorityLogin";
import AdminLogin from "./components/adminLayout/AdminLogin";
import AuthorityMap from "./components/authorityLayout/AuthorityMap";
import ForgotPassword from "./components/guestLayout/ForgotPassword";
import AuthorityProfile from "./components/authorityLayout/AuthorityProfile";
import AdminProfile from "./components/adminLayout/AdminProfile";
import ChangePassword from "./components/userLayout/ChangePassword";


function App() {
  
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
      <Route path="forgotpassword" element={<ForgotPassword/>}/>
      <Route path="/authority/login" element={<AuthorityLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
    </Route>

    <Route path="/user" element={<UserLayout/>}>
      <Route index element={<Dashboard/>}/>
      <Route path="/user/dashboard" element={<Dashboard/>}/>
      <Route path="/user/contacts" element={<Contacts/>}/>
      <Route path="/user/profile" element={<Profile/>}/>
      <Route path="/user/support" element={<Support/>}/>
      <Route path="/user/emergency" element={<EmergencyAlert/>}/>
      <Route path="/user/alerts" element={<MyAlerts/>}/>
      <Route path="/user/changepassword" element={<ChangePassword/>}/>
    </Route>

    <Route path="/admin" element={<AdminLayout/>}>
    <Route index element={<AdminDashboard/>}/>
    <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
    <Route path="/admin/users" element={<ManageUsers/>}/>
    <Route path="/admin/authorities" element={<ManageAuthorities/>}/>
    <Route path="/admin/alerts" element={<ManageAlerts/>}/>
    <Route path="/admin/reports" element={<Reports />} />
    <Route path="/admin/settings" element={<Settings />} />
    <Route path="/admin/profile" element={<AdminProfile />} />
    
    
    </Route>

    <Route path="/authority" element={<AuthorityLayout/>}>
      <Route index element={<AuthorityDashboard/>}/>
      <Route path="/authority/dashboard" element={<AuthorityDashboard/>}/>
      <Route path="/authority/alerts" element={<AuthorityAlerts/>}/>
      <Route path="/authority/map" element={<AuthorityMap/>}/>
      <Route path="/authority/profile" element={<AuthorityProfile/>}/>
      
      
    </Route>


    </Routes>
  );
}

export default App;
