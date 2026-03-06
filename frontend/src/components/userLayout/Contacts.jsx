import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaUser, FaPhone, FaEnvelope, FaHeart, FaTrash } from "react-icons/fa";
import axios from "axios";

const Contacts = () => {

  const token = localStorage.getItem("token");

  const [contacts, setContacts] = useState([]);

  const [formData, setFormData] = useState({
    name1: "",
    email: "",
    phone: "",
    relationship: ""
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  /* ================= FETCH CONTACTS ================= */

  const fetchContacts = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/users/contacts",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContacts(res.data);

    } catch (err) {
      console.log(err);
    }

  };

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  /* ================= ADD CONTACT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:8000/api/users/add-contact",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      /* add new contact instantly */

      setContacts([...contacts, res.data]);

      /* clear form */

      setFormData({
        name1: "",
        email: "",
        phone: "",
        relationship: ""
      });

    } catch (err) {

      console.log(err);

    }

  };

  /* ================= DELETE CONTACT ================= */

  const deleteContact = async (id) => {

    try {

      await axios.delete(
        `http://localhost:8000/api/users/delete-contact/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContacts(contacts.filter(c => c._id !== id));

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <Container className="mt-4">

      <Row>

        {/* ADD CONTACT FORM */}

        <Col md={4}>

          <Card className="shadow border-0">

            <Card.Body>

              <h5 className="mb-3">Add Emergency Contact</h5>

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-2">

                  <Form.Control
                    type="text"
                    name="name1"
                    placeholder="Name"
                    value={formData.name1}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

                <Form.Group className="mb-2">

                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </Form.Group>

                <Form.Group className="mb-2">

                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

                <Form.Group className="mb-3">

                  <Form.Control
                    type="text"
                    name="relationship"
                    placeholder="Relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                  />

                </Form.Group>

                <Button type="submit" className="w-100">
                  Add Contact
                </Button>

              </Form>

            </Card.Body>

          </Card>

        </Col>

        {/* CONTACT LIST */}

        <Col md={8}>

          <Row>

            {contacts.length === 0 && (
              <p className="text-muted">No emergency contacts added.</p>
            )}

            {contacts.map((contact) => (

              <Col md={6} key={contact._id} className="mb-3">

                <Card className="shadow-sm border-0 contact-card">

                  <Card.Body>

                    <h5>
                      <FaUser className="me-2 text-primary"/>
                      {contact.name1}
                    </h5>

                    <p>
                      <FaPhone className="me-2 text-success"/>
                      {contact.phone}
                    </p>

                    <p>
                      <FaEnvelope className="me-2 text-danger"/>
                      {contact.email}
                    </p>

                    <p>
                      <FaHeart className="me-2 text-warning"/>
                      {contact.relationship}
                    </p>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteContact(contact._id)}
                    >
                      <FaTrash className="me-1"/>
                      Delete
                    </Button>

                  </Card.Body>

                </Card>

              </Col>

            ))}

          </Row>

        </Col>

      </Row>

    </Container>

  );

};

export default Contacts;