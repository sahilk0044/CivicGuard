import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    email:"",
    password:""
  });

  const [message,setMessage] = useState("");
  const [type,setType] = useState("");

  useEffect(()=>{
    AOS.init({duration:1000});
  },[]);

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const res = await axios.post(
      "http://localhost:8000/api/users/login",
      formData
    );

    localStorage.setItem("token", res.data.token);

    const role = res.data.user.role; // get role from backend

    localStorage.setItem("role", role);

    setMessage("Login successful! Redirecting...");
    setType("success");

    setTimeout(() => {

      if (role === "admin") {
        navigate("/admin/dashboard");
      }

      else if (role === "authority") {
        navigate("/authority/dashboard");
      }

      else {
        navigate("/user/dashboard");
      }

    }, 1500);

  } catch (err) {

    setMessage(err.response?.data?.message || "Invalid email or password");
    setType("error");

  }
};
  return(
    <>
      <style>{`

      .auth-wrapper{
        min-height:100vh;
        display:flex;
        align-items:center;
        background:linear-gradient(135deg,#8b0000,#ff0000);
      }

      .auth-card{
        background:white;
        padding:45px;
        border-radius:20px;
        box-shadow:0 15px 40px rgba(0,0,0,0.25);
      }

      .auth-title{
        font-weight:700;
        margin-bottom:10px;
      }

      .auth-sub{
        color:#555;
        margin-bottom:20px;
      }

      .auth-btn{
        width:100%;
        background:#ff0000;
        border:none;
        transition:0.3s;
      }

      .auth-btn:hover{
        background:#b30000;
        transform:scale(1.03);
      }

      .message-box{
        padding:10px;
        border-radius:8px;
        margin-bottom:15px;
        font-size:14px;
      }

      .success{
        background:#d4edda;
        color:#155724;
      }

      .error{
        background:#f8d7da;
        color:#721c24;
      }

      .auth-link{
        text-align:center;
        margin-top:15px;
      }

      .auth-link a{
        color:#ff0000;
        text-decoration:none;
        font-weight:500;
      }
        .forgot{
          text-decoration:none;
        }

      `}</style>

      <div className="auth-wrapper">

        <Container>

          <Row className="justify-content-center">

            <Col md={6} data-aos="zoom-in">

              <div className="auth-card">

                <h3 className="auth-title">
                  Login to CivicGuard
                </h3>

                <p className="auth-sub">
                  Access your emergency safety dashboard.
                </p>

                <Form onSubmit={handleSubmit}>

                  {/* MESSAGE ABOVE FIRST FIELD */}

                  {message && (
                    <div className={`message-box ${type}`}>
                      {message}
                    </div>
                  )}

                  {/* EMAIL */}

                  <Form.Group className="mb-3">

                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                  </Form.Group>

                  {/* PASSWORD */}

                  <Form.Group className="mb-3">

                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                  </Form.Group>
                  
               

                  <Button type="submit" className="auth-btn">
                    Login
                  </Button>

                </Form>
                

                <div className="auth-link">
                   <NavLink to="/forgotpassword">Forgot Password</NavLink><br/>
                  Don't have an account? <NavLink to="/register">Register</NavLink>
                  
                
                
                
                </div>

              </div>

            </Col>

          </Row>

        </Container>

      </div>
    </>
  );
};

export default Login;