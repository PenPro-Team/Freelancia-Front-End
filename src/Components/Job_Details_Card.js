import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
import Propose_Card from "./Propose_Card";
import Project_Proposals from "./Project_Proposals";
import { Badge, Placeholder } from "react-bootstrap";
import All_Proposals from "./All_Proposals";
import ClientHistory from "./ClientHistory";
import DrawRequiredSkills from "./DrawRequiredSkills";

function Job_Details_Card(props) {
  const [activeTab, setActiveTab] = useState("first");
  const renderContent = () => {
    switch (activeTab) {
      case "first":
        return (
          <div style={{ position: "relative" }}>
            <div>
              <span className="text-secondary small fw-bold d-flex d-md-none">
                {props.project.creation_date ? (
                  <>Created at:{props.project.creation_date}</>
                ) : (
                  <Placeholder xs={3} size="sm" />
                )}
              </span>
            </div>
            <div className="text-start fs-5 opacity-75">
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
              <span className="w-75">
                {props.project.project_description ? (
                  props.project.project_description
                ) : (
                  <Placeholder xs={4} />
                )}
              </span>
            </div>
            <div>
              <span className="fw-bold">Suggested Budget: </span>
              {props.project.suggested_budget ? (
                props.project.suggested_budget
              ) : (
                <Placeholder xs={2} />
              )}
              <span className="fw-bold"> $</span>
            </div>
            <div>
              <span className="fw-bold">Estimated Project Deadline: </span>

              {props.project.expected_deadline ? (
                <>{props.project.expected_deadline} Days</>
              ) : (
                <Placeholder xs={2} />
              )}
            </div>
            {/* <div>
              <span className="fw-bold">Required Skills:</span>{" "}
              <Badge bg="secondary">{props.project.required_skills}</Badge>
            </div> */}
            {/* <div>
              <span className="fw-bold">Required Skills:</span>{" "}
              {(Array.isArray(props.project.required_skills)
                ? props.project.required_skills
                : (props.project.required_skills || "")
                    .split(",")
                    .map((skill) => skill.trim())
              ).map(
                (skill) =>
                  skill && (
                    <Badge key={skill} bg="secondary" className="me-1">
                      {skill}
                    </Badge>
                  )
              )}
            </div> */}
            <div>
              {props.project.required_skills && (
                <DrawRequiredSkills
                  required_skills={props.project.required_skills}
                />
              )}
            </div>
            <div>
              <span
                className="text-secondary small fw-bold d-none d-md-block"
                style={{ position: "absolute", bottom: "1px", right: "1px" }}
              >
                {props.project.creation_date ? (
                  <>Created at:{props.project.creation_date}</>
                ) : (
                  <Placeholder xs={3} size="sm" />
                )}
              </span>
            </div>
          </div>
        );
      case "second":
        return <Project_Proposals />;
      // case "third":
      //   return <All_Proposals />;
      case "fourth":
        return <ClientHistory owner_id={props.project.owner_id} />; //pass the clinte
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
          {/* <Nav.Item>
            <Nav.Link
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("third");
              }}
              active={activeTab === "third"}
            >
              All Proposals
            </Nav.Link>
          </Nav.Item> */}
          <Nav.Item>
            <Nav.Link
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("fourth");
              }}
              active={activeTab === "fourth"}
            >
              Client History
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
