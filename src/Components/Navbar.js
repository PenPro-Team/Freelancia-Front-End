import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import personalImg from "../assets/default-user.png";
import { getFromLocalStorage, logout } from "../network/local/LocalStorage";
import { logout as userLogout } from "../Redux/Actions/authAction";
import { Axios } from "axios";
import { AxiosUserInstance } from "../network/API/AxiosInstance";
import { useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

function NavBar() {
  const dispatch = useDispatch();
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const isAuth = auth ? auth.isAuthenticated : null;
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!auth) return;
    if (!user) return;
    AxiosUserInstance.get(`${user.user_id}`).then((res) => {
      if (res.data.user_balance) {
        const updatedUser = {
          ...user,
          user_balance: res.data.user_balance,
          name: res.data.name,
          image: res.data.image,
          email: res.data.email,
          rate: res.data.rate,
          role: res.data.role,
          username: res.data.username,
        };
        
        dispatch({
          type: "UPDATE_USER",
          payload: updatedUser,
        });
        localStorage.setItem("auth", JSON.stringify({ ...auth, user: updatedUser }));
      }
    })
    .catch((err) => {
      console.error("Error fetching user data:", err);
      // Handle error (e.g., show a notification)
      logout();
    }
    );

  }, [user, dispatch, auth]);


  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    dispatch(userLogout());
    navigate("/Freelancia-Front-End"); // Corrected to use navigate
  };

  return (
    <Navbar bg="dark" expand="lg" className="navbar-dark">
      <Container>
        <Navbar.Brand as={Link} to="/Freelancia-Front-End/">
          <span className="text-primary">{t('navbar.brand.free')}</span>
          {t('navbar.brand.lancia')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/Freelancia-Front-End/">
              {t('navbar.menu.home')}
            </Nav.Link>
            <Nav.Link as={Link} to="/Freelancia-Front-End/Job_List">
              {t('navbar.menu.projects')}
            </Nav.Link>
            {isAuth && user.role === "freelancer" && (
              <Nav.Link as={Link} to="/Freelancia-Front-End/proposals">
                {t('navbar.menu.myProposals')}
              </Nav.Link>
            )}
            {isAuth && (
              <Nav.Link as={Link} to={`/Freelancia-Front-End/Dashboard/${user.user_id}`}>
                {t('navbar.menu.yourProfile')}
              </Nav.Link>
            )}
            {isAuth && user.role === "client" && (
              <>
                <Nav.Link as={Link} to="/Freelancia-Front-End/postjob">
                  {t('navbar.menu.postJob')}
                </Nav.Link>
                <Nav.Link as={Link} to="/Freelancia-Front-End/clientjoblist">
                  {t('navbar.menu.clientJobList')}
                </Nav.Link>
              </>
            )}
            {isAuth && (
              <>
                <Nav.Link as={Link} to={`/Freelancia-Front-End/clientContracts/${user.user_id}`}>
                  {t('navbar.menu.yourContracts')}
                </Nav.Link>
                <Nav.Link as={Link} to={`/Freelancia-Front-End/chatrooms/`}>
                  {t('navbar.menu.chatRooms')}
                </Nav.Link>
              </>
            )}
            {isAuth && user && user.role === "admin" && (
              <Nav.Link as={Link} to={`/Freelancia-Front-End/admin/`}>
                {t('navbar.menu.adminPanel')}
              </Nav.Link>
            )}
          </Nav>
          {isAuth ? (
            <div className="text-light d-flex flex-row flex-wrap gap-2 align-items-center">
              <Nav.Link as={Link} to={`/Freelancia-Front-End/Dashboard/${user.user_id}`}>
                <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
                  <img
                    className="rounded-circle"
                    width={"48px"}
                    height={"48px"}
                    src={user.image ? user.image : personalImg}
                    alt={user.name}
                  />
                  <span className="fs-5">{user.name}</span>
                  <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
                    <span className="fs-6 text-info">{t('navbar.user.balance')}:</span>
                    <span className="fs-6">${user.user_balance || 0.0}</span>
                  </div>
                </div>
              </Nav.Link>
              <Nav.Link as={Link} to="/Freelancia-Front-End" onClick={handleLogout}>
                <span className="text-danger ms-2">{t('navbar.user.logout')}</span>
              </Nav.Link>
            </div>
          ) : (
            <div className="text-light d-flex flex-row flex-wrap gap-2">
              <Nav.Link as={Link} to="/Freelancia-Front-End/login">
                {t('navbar.auth.login')}
              </Nav.Link>
              <Nav.Link as={Link} to="/Freelancia-Front-End/register">
                {t('navbar.auth.register')}
              </Nav.Link>
            </div>
          )}
          <div className="d-flex align-items-center gap-3 mx-2">
            <LanguageSwitcher />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
