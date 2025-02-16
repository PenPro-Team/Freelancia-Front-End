import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import personalImg from "../assets/hero-bg.jpg";
import JobList from "../Pages/JobList";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/Actions/authAction";
import { getFromLocalStorage, removeFromLocalStorage } from "../network/local/LocalStorage";

function NavBar() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const isAuth = auth ? auth.isAuthenticated : null;
  
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container className="d-flex justify-content-between">
        <Navbar.Brand to="/Freelancia-Front-End/">
          <span className="text-primary">Free</span>Lanceia
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/Freelancia-Front-End/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/Freelancia-Front-End/Job_List">
            Projects
          </Nav.Link>
          {auth.isAuthenticated && auth.user.role == "client" ? (
            <Nav.Link as={Link} to="/Freelancia-Front-End/postjob">
              Post a Job
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/Freelancia-Front-End/postjob" className="d-none">
              Post a Job
            </Nav.Link>
          )}
        </Nav>
        {isAuth ? (
          <div className="text-light d-flex flex-row flex-wrap gap-2 align-items-center">
            <div>
              <img
                className="rounded-circle"
                width={"48px"}
                height={"48px"}
                src={personalImg}
              />
            </div>
            <div className="fs-5">{user.firstName}</div>
            <Nav.Link to="/">
              <span
                className="text-danger ms-2"
                onClick={() => {
                  removeFromLocalStorage("auth");
                }}
              >
                Logout
              </span>
            </Nav.Link>
          </div>
        ) : (
          <div className="text-light d-flex flex-row flex-wrap gap-2">
            <Nav.Link as={Link} to="/Freelancia-Front-End/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/Freelancia-Front-End/register">
              Register
            </Nav.Link>
          </div>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
