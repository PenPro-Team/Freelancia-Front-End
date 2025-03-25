import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import personalImg from "../assets/default-user.png";
import { getFromLocalStorage, logout } from "../network/local/LocalStorage";
import { logout as userLogout } from "../Redux/Actions/authAction";

function NavBar() {
  const dispatch = useDispatch();
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const isAuth = auth ? auth.isAuthenticated : null;
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    dispatch(userLogout());
    navigate("/Freelancia-Front-End"); // Corrected to use navigate
  };

  return (
    <Navbar bg="dark" expand="lg" className="navbar-dark">
      <Container>
        <Navbar.Brand as={Link} to="/Freelancia-Front-End/">
          <span className="text-primary">Free</span>Lanceia
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Freelancia-Front-End/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/Freelancia-Front-End/Job_List">
              Projects
            </Nav.Link>
            {isAuth && user.role === "freelancer" && (
              <Nav.Link as={Link} to="/Freelancia-Front-End/proposals">
                My Proposals
              </Nav.Link>
            )}
            {isAuth && (
              <Nav.Link
                as={Link}
                to={`/Freelancia-Front-End/Dashboard/${user.user_id}`}
              >
                Your Profile
              </Nav.Link>
            )}
            {isAuth && user.role === "client" && (
              <>
                <Nav.Link as={Link} to="/Freelancia-Front-End/postjob">
                  Post a Job
                </Nav.Link>
                <Nav.Link as={Link} to="/Freelancia-Front-End/clientjoblist">
                  Client Job List
                </Nav.Link>
              </>
            )}
            {isAuth && (
              <Nav.Link
                as={Link}
                to={`/Freelancia-Front-End/clientContracts/${user.user_id}`}
              >
                Your Contracts
              </Nav.Link>
            )}
          </Nav>
          {isAuth ? (
            <div className="text-light d-flex flex-row flex-wrap gap-2 align-items-center">
              <Nav.Link
                as={Link}
                to={`/Freelancia-Front-End/Dashboard/${user.user_id}`}
              >
                <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
                  <img
                    className="rounded-circle"
                    width={"48px"}
                    height={"48px"}
                    src={auth.user.image ? auth.user.image : personalImg}
                  />
                  <span className="fs-5">{auth.user.name}</span>
                  <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
                    <span className="fs-6 text-info">Balance:</span>
                    <span className="fs-6">{auth.user.user_balance}$</span>
                  </div>
                </div>

              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/Freelancia-Front-End"
                onClick={(e) => {
                  handleLogout(e);
                }}
              >
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
