import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import personalImg from "../assets/hero-bg.jpg";
import { getFromLocalStorage, logout } from "../network/local/LocalStorage";
import { logout as userLogout } from "../Redux/Actions/authAction";

function NavBar() {
  const dispatch = useDispatch();
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const isAuth = auth ? auth.isAuthenticated : null;
  const history = useHistory();

  const handleLogout = () => {
    logout();
    dispatch(userLogout());
    history.push("/Freelancia-Front-End/login");
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container className="d-flex justify-content-between">
        <Navbar.Brand as={Link} to="/Freelancia-Front-End/">
          <span className="text-primary">Free</span>Lanceia
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/Freelancia-Front-End/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/Freelancia-Front-End/Job_List">
            Projects
          </Nav.Link>
          {isAuth ? (
            user.role === "freelancer" ? (
              <Nav.Link as={Link} to="/Freelancia-Front-End/proposals">
                My Proposals
              </Nav.Link>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {isAuth ? (
            user.role === "client" ? (
              <Nav.Link as={Link} to="/Freelancia-Front-End/postjob">
                Post a Job
              </Nav.Link>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {isAuth ? (
            user.role === "client" ? (
              <Nav.Link as={Link} to="/Freelancia-Front-End/clientjoblist">
                Client Job List
              </Nav.Link>
            ) : (
              ""
            )
          ) : (
            ""
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
                alt=""
              />
            </div>
            <div className="fs-5">{user.firstName}</div>
            <Nav.Link as={Link} to="/" onClick={handleLogout}>
              <span className="text-danger ms-2">Logout</span>
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
