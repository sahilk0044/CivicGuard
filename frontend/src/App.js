import { Route, Routes } from "react-router-dom";
import GuestLayout from "./components/guestLayout/GuestLayout";
import Home from "./components/guestLayout/Home";
import About from "./components/guestLayout/About";
import Features from "./components/guestLayout/Features";
import Contact from "./components/guestLayout/Contact";
import Register from "./components/guestLayout/Register";
import Login from "./components/guestLayout/Login";


function App() {
  return (
    <Routes>
      <Route path="/" element={<GuestLayout/>}>
      <Route path="/home" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="features" element={<Features/>}/>
      <Route path="contact" element={<Contact/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="login" element={<Login/>}/>
      </Route>

    </Routes>
  );
}

export default App;
