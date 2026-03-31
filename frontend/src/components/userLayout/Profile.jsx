import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

const Profile = () => {

  const [user,setUser] = useState({});
  const [formData,setFormData] = useState({
    name:"",
    email:"",
    mobile:"",
    profileImage:null
  });

  const [preview,setPreview] = useState(null);
  const [loading,setLoading] = useState(true);
  const [editMode,setEditMode] = useState(false);
  const [message,setMessage] = useState(null);
  const [error,setError] = useState(null);

  useEffect(()=>{

    AOS.init({duration:1000});
    fetchProfile();

  },[]);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async ()=>{

    try{

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8000/api/users/profile", // ✅ FIXED
        {
          headers:{Authorization:`Bearer ${token}`}
        }
      );

      setUser(res.data);

      setFormData({
        name:res.data.name,
        email:res.data.email,
        mobile:res.data.mobile,
        profileImage:null
      });

      setPreview(null);
      setMessage(null);
      setError(null);
      setLoading(false);

    }catch(err){

      setError("Failed to load profile");
      setLoading(false);

    }

  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e)=>{

    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });

  };

  /* ================= IMAGE PREVIEW ================= */

  const handleImageChange = (e)=>{
    const file = e.target.files[0];

    if(file){
      setFormData({
        ...formData,
        profileImage:file
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  /* ================= UPDATE PROFILE ================= */

  const updateProfile = async (e)=>{

    e.preventDefault();

    try{

      const token = localStorage.getItem("token");

      const form = new FormData();

      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("mobile", formData.mobile);

      if(formData.profileImage){
        form.append("profileImage", formData.profileImage);
      }

      const res = await axios.put(
        "http://localhost:8000/api/users/update-profile", // ✅ FIXED
        form,
        {
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"multipart/form-data"
          }
        }
      );

      setMessage(res.data.message || "Profile updated successfully");
      setError(null);
      setEditMode(false);

      fetchProfile();

    }catch(err){

      setError("Failed to update profile");
      setMessage(null);

    }

  };

  /* ================= LOADING ================= */

  if(loading){
    return(
      <Container className="text-center mt-5">
        <Spinner animation="border"/>
      </Container>
    )
  }

  return(

<>
<style>

{`

.profile-page{
min-height:100vh;
background: linear-gradient(135deg, #fdf2f8, #eef2ff, #e0f2fe);
display:flex;
align-items:center;
justify-content:center;
padding:40px;
}

.profile-card{
width:380px;
border-radius:18px;
background:linear-gradient(135deg,#ff3c3c,#007bff);
color:white;
padding:35px;
box-shadow:0 20px 45px rgba(0,0,0,0.25);
}

.profile-avatar{
width:90px;
height:90px;
border-radius:50%;
background:white;
color:#007bff;
font-size:38px;
font-weight:bold;
display:flex;
align-items:center;
justify-content:center;
margin:auto;
margin-bottom:20px;
overflow:hidden;
}

.profile-avatar img{
width:100%;
height:100%;
object-fit:cover;
}

.profile-title{
text-align:center;
font-weight:600;
margin-bottom:25px;
}

.profile-input{
background:transparent;
border:none;
border-radius:5;
}

.profile-input:focus{
background:transparent;
color:white;
box-shadow:none;
border-bottom:1px solid white;
}

.profile-label{
font-size:14px;
opacity:0.9;
}

.profile-btn{
margin-top:15px;
width:100%;
border-radius:30px;
background:white;
color:#333;
font-weight:600;
border:none;
}

.profile-btn:hover{
opacity:0.9;
}

.profile-btn-secondary{
margin-top:10px;
border-radius:30px;
width:100%;
}

`}

</style>

<div className="profile-page">

<Row>

<Col data-aos="zoom-in">

<motion.div
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.5}}
>

<Card className="profile-card">

<Card.Body>

{/* PROFILE IMAGE */}

<div className="profile-avatar">

{preview ? (

<img src={preview} alt="preview"/>

) : user.profileImage ? (

<img
src={`http://localhost:8000/${user.profileImage}`}
alt="profile"
/>

) : (

user.name?.charAt(0).toUpperCase()

)}

</div>

<h4 className="profile-title">User Profile</h4>

{message && <Alert variant="success">{message}</Alert>}
{error && <Alert variant="danger">{error}</Alert>}

<Form onSubmit={updateProfile}>

{/* NAME */}
<Form.Group className="mb-3">
<Form.Label className="profile-label">
<FaUser className="me-2"/>Name
</Form.Label>

<Form.Control
className="profile-input"
type="text"
name="name"
value={formData.name}
onChange={handleChange}
disabled={!editMode}
/>
</Form.Group>

{/* EMAIL */}
<Form.Group className="mb-3">
<Form.Label className="profile-label">
<FaEnvelope className="me-2"/>Email
</Form.Label>

<Form.Control
className="profile-input"
type="email"
value={formData.email}
disabled
/>
</Form.Group>

{/* MOBILE */}
<Form.Group className="mb-3">
<Form.Label className="profile-label">
<FaPhone className="me-2"/>Mobile
</Form.Label>

<Form.Control
className="profile-input"
type="text"
name="mobile"
value={formData.mobile}
onChange={handleChange}
disabled={!editMode}
/>
</Form.Group>

{/* IMAGE */}
<Form.Group className="mb-3">
<Form.Label className="profile-label">
Profile Image
</Form.Label>

<Form.Control
type="file"
onChange={handleImageChange}
disabled={!editMode}
/>
</Form.Group>

{!editMode ? (

<Button
className="profile-btn"
onClick={()=>setEditMode(true)}
>
Update Profile
</Button>

) : (

<>

<Button type="submit" className="profile-btn">
Save Changes
</Button>

<Button
variant="light"
className="profile-btn-secondary"
onClick={()=>setEditMode(false)}
>
Cancel
</Button>

</>

)}

</Form>

</Card.Body>

</Card>

</motion.div>

</Col>

</Row>

</div>

</>

  )

}

export default Profile;