import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom"; // Fixed Import Path
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getFromLocalStorage } from "../network/local/LocalStorage";

const Footer = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const auth = getFromLocalStorage("auth")
  const user = auth ? auth.user : null;
  const userRole = user ? user.role : null;
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter freelancers by username
    const results = freelancers.filter((freelancer) =>
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <footer className="container-fluid blackBack mt-5 py-5">
      <Container className="text-light">
        <Row className="gy-4">
          {/* Contact Section */}
          <Col xs={12} lg={6} className="text-center text-lg-start">
            <h2>Let's Take</h2>
            <p>
              Every project starts with a chat. Joven leads our client
              conversations and will be happy to discuss your project. He will
              also pull in the right people from the team when needed.
            </p>
            {userRole === "client" ? 
              <Link to={`/Freelancia-Front-End/postjob`}>
                <Button className="btn btn-primary">Share your project!</Button>
              </Link>
              : userRole == "freelancer"? <Link to={`/Freelancia-Front-End/Dashboard/${user.user_id}`}>
                <Button className="btn btn-primary">View Portfolio</Button>
              </Link>
              : <Link to={`/Freelancia-Front-End/login`}>
                <Button className="btn btn-primary">Login to show your skills!</Button>
              </Link>
            }
          </Col>

          {/* Links Section */}
          <Col xs={6} lg={3} className="text-center text-lg-start">
            <h5>Our Resources</h5>
            <Link className="text-decoration-none text-primary d-block" to="/links">
              Links
            </Link>
            <Link className="text-decoration-none text-primary d-block" to="/home">
              Home
            </Link>
            <Link className="text-decoration-none text-primary d-block" to="/portfolio">
              Portfolio
            </Link>
          </Col>

          {/* Search Section */}
          <Col xs={12} lg={3}>
            <div className="d-flex flex-column">
              {/* Search Input */}
              <Form onSubmit={handleSearch} className="d-flex mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by username"
                  className="me-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="btn-primary">
                  Search
                </Button>
              </Form>

              {/* Copyright */}
              <div className="mt-4 text-center text-lg-start">
                © 2025, FreeLancia.com for PenPro Team
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
