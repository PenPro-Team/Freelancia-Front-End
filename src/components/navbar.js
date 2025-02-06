import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Row, Col } from 'react-bootstrap'
function NavBar() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container className='d-flex justify-content-between'>
          <Navbar.Brand to="/"><span className='text-primary '>Free</span>Lanceia</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link to="/">Home</Nav.Link>
            <Nav.Link to="/">Features</Nav.Link>
          </Nav>
          <div className='text-light d-flex flex-row flex-wrap gap-2'>
            <Nav.Link to="/">Login</Nav.Link>
            <Nav.Link to="/">Regester</Nav.Link>
          </div>

        </Container>
      </Navbar>
      <br />
      
    </>
  );
}

export default NavBar;