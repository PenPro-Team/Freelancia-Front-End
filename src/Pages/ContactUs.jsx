import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle form submission
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center mb-5">
                <Col md={8}>
                    <h2 className="text-center mb-4">Contact Us</h2>
                    <p className="text-center text-muted">
                        Have questions? We'd love to hear from you. Send us a message
                        and we'll respond as soon as possible.
                    </p>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={4}>
                    <Card className="mb-3 h-100">
                        <Card.Body className="text-center">
                            <FaEnvelope className="text-primary mb-3" size={30} />
                            <h5>Email</h5>
                            <p>support@freelancia.com</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3 h-100">
                        <Card.Body className="text-center">
                            <FaPhone className="text-primary mb-3" size={30} />
                            <h5>Phone</h5>
                            <p>+1 234 567 8900</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-3 h-100">
                        <Card.Body className="text-center">
                            <FaMapMarkerAlt className="text-primary mb-3" size={30} />
                            <h5>Location</h5>
                            <p>Cairo, Egypt</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={8}>
                    {showAlert && (
                        <Alert variant="success" className="mb-4">
                            Thank you for your message. We'll get back to you soon!
                        </Alert>
                    )}
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" className="w-100">
                                    Send Message
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactUs;
