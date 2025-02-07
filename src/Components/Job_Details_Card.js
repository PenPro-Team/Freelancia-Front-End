import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
import Propose_Card from "./Propose_Card";
import Project_Proposals from "./Project_Proposals";
import { Badge } from "react-bootstrap";
import All_Proposals from "./All_Proposals";

function Job_Details_Card(props) {
  const [activeTab, setActiveTab] = useState("first");

  const renderContent = () => {
    switch (activeTab) {
      case "first":
        return (
          <div>
            <div>
              {/* <span className="fw-bold">Project State: </span> */}
              <Badge
                bg={
                  props.project.job_state === "finished"
                    ? "dark"
                    : props.project.job_state === "open"
                    ? "primary"
                    : props.project.job_state === "ongoing"
                    ? "success"
                    : props.project.job_state === "canceled"
                    ? "danger"
                    : props.project.job_state ===
                      "contract canceled and reopened"
                    ? "success"
                    : "secondary"
                }
              >
                {props.project.job_state}
              </Badge>
            </div>
            <div>
              <span className="fw-bold">project Description: </span>{" "}
              <span className="w-75">{props.project.project_description}</span>
            </div>
            <div>
              <span className="fw-bold">Suggested Budget: </span>
              {props.project.suggested_budget}
              <span className="fw-bold">$</span>
            </div>
            <div>
              <span className="fw-bold">Project Deadline: </span>{" "}
              {props.project.expected_deadline}
            </div>
            <div>
              <span className="fw-bold">Required Skills:</span>{" "}
              <Badge bg="secondary">{props.project.required_skills}</Badge>
            </div>
          </div>
        );
      case "second":
        return <Project_Proposals />;
      case "third":
        return <All_Proposals />;
      default:
        return "Disabled content or default content here.";
    }
  };

  return (
    <Card>
      <Card.Header>
        <Nav variant="tabs" defaultActiveKey="#first">
          <Nav.Item>
            <Nav.Link
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("first");
              }}
              active={activeTab === "first"}
            >
              Details
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("second");
              }}
              active={activeTab === "second"}
            >
              Proposals
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("third");
              }}
              active={activeTab === "third"}
            >
              All Proposals
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        {/* <Card.Title>{props.project.project_name}</Card.Title> */}
        <div>{renderContent()}</div>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
  );
}

export default Job_Details_Card;
