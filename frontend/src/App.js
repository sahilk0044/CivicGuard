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
    
    </Route>


    </Routes>
  );
}

export default App;
