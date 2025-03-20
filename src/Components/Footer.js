import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Footer = () => {
  return (
    <footer className="container-fluid blackBack mt-5 p-5">
      <Container className="text-light">
        <Row className="flex-column flex-lg-row">
          {/* Contact Section */}
          <Col xs={12} md={6} className="mb-4">
            <h2>Let's Take</h2>
            <p>
              Every project starts with a chat. Joven leads our client
              conversations and will be happy to discuss your project. He will
              also pull in the right people from the team when needed.
            </p>
            <button className="btn btn-primary w-100 w-md-50">
              Tell Us About Your Project
            </button>
          </Col>

          {/* Links Section */}
          <Col xs={6} md={3} className="mb-4">
            <h5>Our Resources</h5>
            <Link
              className="text-decoration-none text-primary d-block"
              to="/links"
            >
              Links
            </Link>
            <Link
              className="text-decoration-none text-primary d-block"
              to="/home"
            >
              Home
            </Link>
            <Link
              className="text-decoration-none text-primary d-block"
              to="/portfolio"
            >
              Portfolio
            </Link>
          </Col>

          {/* Search and Copyright Section */}
          <Col xs={12} md={3} className="mt-4 mt-md-0">
            <div className="d-flex flex-column">
              {/* Search Input */}
              <div className="d-flex">
                <input
                  type="text"
                  placeholder="Take a look on the platform"
                  className="form-control"
                />
                <button className="btn btn-primary ms-2">Search</button>
              </div>

              {/* Copyright */}
              <div className="mt-5 text-center">
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
