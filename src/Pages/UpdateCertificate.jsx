import { useState } from "react";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { AxiosFreelancersCertificate } from "../network/API/AxiosInstance";
import { useParams } from "react-router-dom";
import { getFromLocalStorage } from "../network/local/LocalStorage";
function UpdateCertificate() {
  const auth = getFromLocalStorage("auth");
  // localStorage.setItem("authToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0MDU5NzEzLCJpYXQiOjE3NDI3NjM3MTMsImp0aSI6ImMyNjU3ZGE0ZjJhZTRlZGU4ZjhhNmQ0ZjEwYmJhYzAzIiwidXNlcl9pZCI6M30.Zxs6yYW6JR0oKGSzImEe9AgR4Qo6K83UmavC49Jtl8Q");
  const { user_id } = useParams(); // Extract user ID from route params
  const [formData, setFormData] = useState({
    image: null, // File input for image
    title: "",
    description: "",
    issued_by: "",
    issued_date: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] })); // Handle file input
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isDateValid = () => {
    const today = new Date();
    const selectedDate = new Date(formData.issued_date);
    return selectedDate <= today; // Date must not be in the future
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // Reset message
    setError(""); // Reset error

    const data = new FormData();
    data.append("user", user_id);
    data.append("image", formData.image);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("issued_by", formData.issued_by);
    data.append("issued_date", formData.issued_date);

    // const token = localStorage.getItem("authToken");

    // Send POST request with authentication header
    AxiosFreelancersCertificate.post("", data, {
      headers: {
        Authorization: `Bearer ${auth.user.access}`, // Include token in Authorization header
      },
    })
      .then((response) => {
        setMessage("Certificate uploaded successfully");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading certificate:", error);
        setError("Failed to upload certificate. Please try again.");
      });
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={24}>
        <Card className="shadow-lg p-3 mb-5 bg-white rounded">
          <Card.Body>
            <Card.Title className="text-center">Upload Certificate</Card.Title>
            <Form onSubmit={handleSubmit}>
              {/* Image Input */}
              <Form.Group controlId="image" className="mb-3">
                <Form.Label>Certificate Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  required
                />
              </Form.Group>

              {/* Title Input */}
              <Form.Group controlId="title" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter certificate title"
                  required
                />
              </Form.Group>

              {/* Description Input */}
              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter certificate description"
                  required
                />
              </Form.Group>

              {/* Issued By Input */}
              <Form.Group controlId="issued_by" className="mb-3">
                <Form.Label>Issued By</Form.Label>
                <Form.Control
                  type="text"
                  name="issued_by"
                  value={formData.issued_by}
                  onChange={handleChange}
                  placeholder="Enter issuing organization"
                  required
                />
              </Form.Group>

              {/* Issued Date Input */}
              <Form.Group controlId="issued_date" className="mb-3">
                <Form.Label>Issued Date</Form.Label>
                <Form.Control
                  type="date"
                  name="issued_date"
                  value={formData.issued_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Button
                variant="primary"
                type="submit"
                disabled={!isDateValid()} // Disable if the date is invalid
              >
                Upload Certificate
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default UpdateCertificate;
