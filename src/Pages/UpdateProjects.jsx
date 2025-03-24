import { useState } from "react";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import { AxiosFreelancersPortfolios } from "../network/API/AxiosInstance";
import { useParams } from "react-router-dom";
import { getFromLocalStorage } from "../network/local/LocalStorage";

function UpdateProjects() {
  const auth = getFromLocalStorage("auth");
  const { user_id } = useParams(); // Extract user ID from route params
  const [formData, setFormData] = useState({
    main_image: null, // Single file for main image
    images: [], // Multiple files for additional images
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (name === "main_image") {
        // Handle single file input for main_image
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
      } else if (name === "images") {
        // Handle multiple file input for images
        setFormData((prev) => ({ ...prev, [name]: files }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(""); // Reset message
    setError(""); // Reset error

    const data = new FormData();
    data.append("user", user_id);
    data.append("main_image", formData.main_image); // Add main image
    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]); // Add multiple images
    }
    data.append("title", formData.title);
    data.append("description", formData.description);

    // Send POST request with authentication header
    AxiosFreelancersPortfolios.post("", data, {
      headers: {
        Authorization: `Bearer ${auth.user.access}`, // Include token in Authorization header
      },
    })
      .then((response) => {
        setMessage("Project uploaded successfully!");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading project:", error);
        setError("Failed to upload project. Please try again.");
      });
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={24}>
        <Card className="shadow-lg p-3 mb-5 bg-white rounded">
          <Card.Body>
            <Card.Title className="text-center">Upload Project</Card.Title>
            <Form onSubmit={handleSubmit}>
              {/* Main Image Input */}
              <Form.Group controlId="main_image" className="mb-3">
                <Form.Label>Main Image</Form.Label>
                <Form.Control
                  type="file"
                  name="main_image"
                  onChange={handleChange}
                  accept="image/*"
                  required
                />
              </Form.Group>

              {/* Additional Images Input */}
              <Form.Group controlId="images" className="mb-3">
                <Form.Label>Additional Images</Form.Label>
                <Form.Control
                  type="file"
                  name="images"
                  onChange={handleChange}
                  accept="image/*"
                  multiple
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
                  placeholder="Enter project title"
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
                  placeholder="Enter project description"
                  required
                />
              </Form.Group>

              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Button variant="primary" type="submit">
                Upload Project
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default UpdateProjects;
