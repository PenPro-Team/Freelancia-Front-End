import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand to="/">
            <span className="text-primary ">Free</span>Lanceia
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/job_details/9">
              Projects
            </Nav.Link>
          </Nav>
          <div className="text-light d-flex flex-row flex-wrap gap-2">
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Regester
            </Nav.Link>
          </div>
        </Container>
      </Navbar>
      <br />
    </>
  );
}

export default NavBar;
