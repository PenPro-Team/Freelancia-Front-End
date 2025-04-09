import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { AxiosContactInstance } from "../network/API/AxiosInstance";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [showAlert, setShowAlert] = useState({
    show: false,
    variant: "success",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await AxiosContactInstance.post("/", formData);
      setShowAlert({
        show: true,
        variant: "success",
        message: "Thank you for your message! We will get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      if (error.response && error.response.data) {
        // Handle validation errors from backend
        setErrors(error.response.data);
        setShowAlert({
          show: true,
          variant: "danger",
          message: "Please correct the errors in the form.",
        });
      } else {
        setShowAlert({
          show: true,
          variant: "danger",
          message:
            "An error occurred while sending your message. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowAlert({ ...showAlert, show: false }), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <h2 className="text-center mb-4">Contact Us</h2>
          <p className="text-center text-muted">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
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
          {showAlert.show && (
            <Alert
              variant={showAlert.variant}
              className="mb-4"
              onClose={() => setShowAlert({ ...showAlert, show: false })}
              dismissible
            >
              {showAlert.message}
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
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    isInvalid={!!errors.subject}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subject}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    isInvalid={!!errors.message}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Send Message"
                  )}
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
