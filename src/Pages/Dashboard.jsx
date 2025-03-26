import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import HeaderColoredText from "../Components/HeaderColoredText";
import ClientInfo from "../Components/client-dashboard/ClientInfo";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import EditClientInfo from "../Components/client-dashboard/EditClientInfo";
import EditSecurity from "../Components/client-dashboard/EditSecurity";
import { useNavigate, useParams } from "react-router-dom";
import UpdateSkills from "./UpdateSkills";
import DesplaySkills from "./DesplaySkills";
import { useEffect, useState } from "react";
import UpdateCertificate from "./UpdateCertificate";
import UpdateProjects from "./UpdateProjects";
import { AxiosUserInstance } from "../network/API/AxiosInstance";
import DisplayCertificate from "./DisplayCertificate";
import DisplayProjects from "./DisplayProjects";
import Wallet from "../Components/wallet/Wallet";

function Dashboard() {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const params = useParams();
  const user_id = params.user_id;
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const navigate = useNavigate();
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    console.log("Params:", params.user_id);
    AxiosUserInstance.get(`${params.user_id}`)
      .then((res) => {
        setUserData(res.data);
        console.log("User Data from api", res.data);
        if (Object.keys(res.data).length) {
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
          navigate("/Freelancia-Front-End/404"); // Updated from history.push
        }
      })
      .catch((err) => {
        console.log(err);
        setIsEmpty(true);
        navigate("/Freelancia-Front-End/404"); // Updated from history.push
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.user_id, refreshFlag, navigate]); // Fixed dependency list

  const refresh = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="container-fluid px-5">
      <HeaderColoredText text="Dashboard" />
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column m-5">
              <Nav.Item>
                <Nav.Link eventKey="first">User Info</Nav.Link>
              </Nav.Item>
              {auth &&
                user &&
                user.user_id == user_id &&
                user.user_id == userData.id && (
                  <>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Update Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Update Security</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="sixth">Wallet</Nav.Link>
                    </Nav.Item>
                    {auth && auth.user && auth.user.role === "freelancer" && (
                      <Nav.Item>
                        <Nav.Link eventKey="fourth">Update Skills</Nav.Link>
                      </Nav.Item>
                    )}
                    {auth && auth.user && auth.user.role === "freelancer" && (
                      <Nav.Item>
                        <Nav.Link eventKey="ten">Update Certificate</Nav.Link>
                      </Nav.Item>
                    )}
                    {auth && auth.user && auth.user.role === "freelancer" && (
                      <Nav.Item>
                        <Nav.Link eventKey="elevn">Update Projects</Nav.Link>
                      </Nav.Item>
                    )}
                  </>
                )}
              {userData.role === "freelancer" && (
                <>
                  <Nav.Item>
                    <Nav.Link eventKey="fifth">Skills</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="eight">Certificate</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="seven">Projects</Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <ClientInfo refreshFlag={refreshFlag} />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <EditClientInfo cb={refresh} />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <EditSecurity />
              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <UpdateSkills />
              </Tab.Pane>
              <Tab.Pane eventKey="fifth">
                <DesplaySkills />
                {/* <ManageSkills /> */}
              </Tab.Pane>
              <Tab.Pane eventKey="ten">
                <UpdateCertificate />
                {/* <ManageSkills /> */}
              </Tab.Pane>
              <Tab.Pane eventKey="eight">
                <DisplayCertificate />
              </Tab.Pane>
              <Tab.Pane eventKey="elevn">
                <UpdateProjects />
              </Tab.Pane>
              <Tab.Pane eventKey="sixth">
                <Wallet />
              </Tab.Pane>
              <Tab.Pane eventKey="seven">
                <DisplayProjects />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default Dashboard;
