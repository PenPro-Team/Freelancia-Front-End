import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
import ProjectProposals from "./ProjectProposals";
import { Badge, Placeholder, Modal, Button } from "react-bootstrap";
import ClientHistory from "./ClientHistory";
import DrawRequiredSkills from "./DrawRequiredSkills";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { AiFillSetting } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import { useHistory } from "react-router-dom";
// ----------
// Added cancel functionality import
import { AxiosProjectsInstance } from "../network/API/AxiosInstance";
// ----------

function JobDetailsCard(props) {
  const [activeTab, setActiveTab] = useState("first");
  const history = useHistory();
  const auth = getFromLocalStorage("auth");
  
  // ----------
// Added cancel functionality state and functions
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");



  const handleCancelJob = (cancelType) => {
    setCancelSubmitting(true);
    setCancelMessage("");
    let newJobState;
  
    if (props.project.job_state === "ongoing" && cancelType) {
      if (cancelType === "contract") {
        newJobState = "contract canceled and reopened";
      } else if (cancelType === "full") {
        newJobState = "canceled";
      }
    } else {
      newJobState = "canceled";
    }
  
    AxiosProjectsInstance.patch(`/${props.project.id}`, {
      job_state: newJobState,
    })
      .then((res) => {
        console.log(res.data);
        console.log("refresh");
        props.actionCB();
        setCancelMessage(
          newJobState === "canceled"
            ? "Job canceled successfully"
            : "Contract canceled successfully, job reopened"
        );
        setShowCancelModal(false);
      })
      .catch((error) => {
        console.error("Error canceling job:", error);
        setCancelMessage("Failed to cancel job.");
      })
      .finally(() => {
        setCancelSubmitting(false);
      });
  };
  
// ----------
  
  const renderContent = () => {
    switch (activeTab) {
      case "first":
        return (
          <div style={{ position: "relative" }}>
            <div>
              <span className="text-secondary small fw-bold d-flex d-md-none">
                {props.project.creation_date ? (
                  <>Created at: {props.project.creation_date}</>
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
                    : props.project.job_state === "contract canceled and reopened"
                    ? "success"
                    : "secondary"
                }
              >
                {props.project.job_state}
              </Badge>
            </div>
            {props.showTitle && (
              <div>
                <span className="fw-bold">Project Title: </span>{" "}
                <span className="w-75">
                  {props.project.project_name ? (
                    props.project.project_name
                  ) : (
                    <Placeholder xs={2} />
                  )}
                </span>
              </div>
            )}
            <div>
              <span className="fw-bold">Project Description: </span>{" "}
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
                  <>Created at: {props.project.creation_date}</>
                ) : (
                  <Placeholder xs={3} size="sm" />
                )}
              </span>
            </div>
            <div
              className="d-flex flex-row flex-wrap gap-1"
              style={{ position: "absolute", right: "1px", top: "1px" }}
            >
              {auth &&
                auth.isAuthenticated &&
                auth.user.role === "client" &&
                props.project.owner_id === auth.user.id &&
                (props.project.job_state === "open" ||
                  props.project.job_state === "contract canceled and reopened" ||
                  props.project.job_state === "ongoing") && (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      history.push("/Freelancia-Front-End/postjob", {
                        mode: "update",
                        jobData: props.project,
                      })
                    }
                    }
                  >
                    <AiFillSetting color="" size="1.25rem" />
                  </div>
                )}
              {auth &&
                auth.isAuthenticated &&
                auth.user.role === "client" &&
                props.project.owner_id === auth.user.id &&
                (props.project.job_state === "open" ||
                  props.project.job_state === "contract canceled and reopened") && (
                  <div style={{ cursor: "pointer" }} onClick={() => {
                    setShowCancelModal(true)
                  }}>
                    <TiCancel color="red" size="1.5rem" />
                  </div>
                )}
              {auth &&
                auth.isAuthenticated &&
                auth.user.role === "client" &&
                props.project.owner_id === auth.user.id &&
                props.project.job_state === "ongoing" && (
                  <div style={{ cursor: "pointer" }} onClick={() => {
                    setShowCancelModal(true) 
                }}>
                    <TiCancel color="red" size="1.5rem" />
                  </div>
                )}
            </div>
          </div>
        );
      case "second":
        return <ProjectProposals />;
      // case "third":
      //   return <All_Proposals />;
      case "fourth":
        return <ClientHistory owner_id={props.project.owner_id} />;
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
      {/* ---------- */}
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancellation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {props.project.job_state === "ongoing" ? (
              <p>
                Do you want to end the contract with the current client and reopen the job, or do you want to cancel the job entirely?
              </p>
            ) : (
              <p>Are you sure you want to cancel this job?</p>
            )}
            {cancelMessage && <p>{cancelMessage}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              No
            </Button>
            {props.project.job_state === "ongoing" ? (
              <>
                <Button
                  variant="warning"
                  onClick={() => handleCancelJob("contract")}
                  disabled={cancelSubmitting}
                >
                  {cancelSubmitting ? "Processing..." : "End Contract & Reopen Job"}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleCancelJob("full")}
                  disabled={cancelSubmitting}
                >
                  {cancelSubmitting ? "Processing..." : "Cancel Job"}
                </Button>
              </>
            ) : (
              <Button
                variant="danger"
                onClick={() => handleCancelJob()}
                disabled={cancelSubmitting}
              >
                {cancelSubmitting ? "Processing..." : "Yes, Cancel Job"}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
      {/* ---------- */}
    </Card>
  );
}

export default JobDetailsCard;
