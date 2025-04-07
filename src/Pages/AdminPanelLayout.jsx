import { Col, Nav, Row, Tab } from "react-bootstrap";
import HeaderColoredText from "../Components/HeaderColoredText";
import UserReportsTab from "../Components/Admin-Panel/UserReportsTab";
import ContractReportsTab from "../Components/Admin-Panel/ContractReportsTab";
import BannedUsersTab from "../Components/Admin-Panel/BannedUsersTab";
import WithdrawalsTab from "../Components/Admin-Panel/WithdrawalsTab";
import { useState } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function AdminPanelLayout() {
  const [activeTab, setActiveTab] = useState("user-reports");
  const navigate = useNavigate();
  const auth = getFromLocalStorage("auth");

  useEffect(() => {
    if (!auth || !auth.user || auth.user.role !== "admin") {
      navigate("/Freelancia-Front-End/404");
    }
  }, [auth, navigate]);

  return (
    <div className="container-fluid px-5">
      <HeaderColoredText text="Admin Panel" />
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column m-5">
              <Nav.Item>
                <Nav.Link eventKey="user-reports">User Reports</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="contract-reports">
                  Contract Reports
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="withdrawals">Withdrawals</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="banned-users">Banned Users</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="user-reports">
                <UserReportsTab />
              </Tab.Pane>
              <Tab.Pane eventKey="contract-reports">
                <ContractReportsTab />
              </Tab.Pane>
              <Tab.Pane eventKey="withdrawals">
                <WithdrawalsTab />
              </Tab.Pane>
              <Tab.Pane eventKey="banned-users">
                <BannedUsersTab />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default AdminPanelLayout;
