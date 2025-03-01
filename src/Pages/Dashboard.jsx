import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import HeaderColoredText from "../Components/HeaderColoredText";
import ClientInfo from "../Components/client-dashboard/ClientInfo";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import EditClientInfo from "../Components/client-dashboard/EditClientInfo";
import EditSecurity from "../Components/client-dashboard/EditSecurity";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import FreelancerProfile from "./UpdateSkills";
import UpdateSkills from "./UpdateSkills";
import DesplaySkills from "./DesplaySkills";
import UpdateCertificate from "./UpdateCertificate";
import UpdateProjects from "./UpdateProjects";

function Dashboard() {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const params = useParams();
  const user_id = params.user_id;
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
              {auth && user && user.id == user_id && (
                <>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Update Profile</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Update Secuity</Nav.Link>
                  </Nav.Item>
                  {auth && auth.user && auth.user.role === "freelancer" && (
                    <Nav.Item>
                      <Nav.Link eventKey="fourth">Update Skills</Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                      <Nav.Link eventKey="fifth">Skills</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                      <Nav.Link eventKey="six">Certificate</Nav.Link>
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
                <ClientInfo />{" "}
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <EditClientInfo />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <EditSecurity />
              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <UpdateSkills/>
              </Tab.Pane>
              <Tab.Pane eventKey="fifth">
                <DesplaySkills/>
              </Tab.Pane>
              <Tab.Pane eventKey="six">
                <UpdateCertificate/>
              </Tab.Pane>
              <Tab.Pane eventKey="seven">
                <UpdateProjects/>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default Dashboard;
