import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import personalImg from "../assets/IMG-20230124-WA0049.jpg"
function NavBar() {
    const state = useSelector((state) => state.auth);
    const user = state ? state.user : null;
    const isAuth = state ? state.isAuthenticated : null;

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container className="d-flex justify-content-between">
                <Navbar.Brand to="/">
                    <span className="text-primary">Free</span>Lanceia
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">
                        Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/job_details/9">
                        Projects
                    </Nav.Link>
                </Nav>
                {isAuth ? (
                    <div className="text-light d-flex flex-row flex-wrap gap-2 align-items-center">
                      <div>
                        <img className="rounded-circle" width={"48px"} height={"48px"} src={personalImg}/>
                      </div>

                      <div className="fs-5">
                        {user.firstName}
                      </div>
                      </div>
                ) : (
                    <div className="text-light d-flex flex-row flex-wrap gap-2">
                        <Nav.Link as={Link} to="/login">
                            Login
                        </Nav.Link>
                        <Nav.Link as={Link} to="/register">
                            Register
                        </Nav.Link>
                    </div>
                )}
            </Container>
        </Navbar>
    );
}

export default NavBar;
