import { Button, Card, Image } from "react-bootstrap";
import RateStars from "./RateStars";
import { useNavigate } from "react-router-dom"; // Corrected import path
import { getFromLocalStorage } from "../network/local/LocalStorage";
function FreelancerProposalsCard(props) {
  const navigate = useNavigate(); // Correct usage of useNavigate
  const curenUser = getFromLocalStorage("auth");
  return (
    <Card key={props.proposal.id} className="mb-3">
      <Card.Body style={{ position: "relative" }}>
        <Card.Title>
          <div className="d-flex justify-content-between">

            <div className="d-flex align-items-center">
              <Image
                src={props.proposal.user.image}
                roundedCircle
                alt={props.proposal.user.name}
                width={50}
                height={50}
                className="me-2"
              />
              <div className="d-flex flex-column">
                <div>{props.proposal.user.name}</div>
                <div className="text-muted">
                  <RateStars rating={props.proposal.user.rate} />
                </div>
              </div>
            </div>

            {
              curenUser.user.role === "client" && (
                <div>
                  <Button
                    className="btn btn-primary"
                    onClick={() => {
                      navigate( "/Freelancia-Front-End/contract",{  state: { proposal: props.proposal } });
                    }}
                  >
                    Contract
                  </Button>
                </div>
              )
            }
          </div>
        </Card.Title>
        <div className="mt-2">
          <span className="fw-bold">Deadline: </span>
          {props.proposal.deadline} <span className="fw-bold">Days</span>
        </div>
        <div>
          <span className="fw-bold">Price: </span>
          {props.proposal.price} <span className="fw-bold">$</span>
        </div>
        <div className="fw-bold">Propose Message:</div>
        <div>{props.proposal.propose_text}</div>
        {props.proposal.created_at && (
          <div>
            <span
              className="text-secondary small fw-bold"
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
              }}
            >
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(new Date(props.proposal.created_at))}
            </span>
          </div>
        )}
        {props.showBtn && (
          <div
            className="d-none d-md-block"
            style={{ position: "absolute", top: "5px", right: "5px" }}
          >
            <Button
              className="btn btn-primary"
              onClick={() => {
                navigate(
                  `/Freelancia-Front-End/job_details/${props.proposal.project.id}`
                );
              }}
            >
              View The Project
            </Button>
          </div>
        )}
      </Card.Body>
      {props.showBtn && (
        <div className="w-100 d-block d-md-none">
          <Button
            className="btn btn-primary w-100"
            onClick={() => {
              navigate(
                `/Freelancia-Front-End/job_details/${props.proposal.project_id}`
              );
            }}
          >
            View The Project
          </Button>
        </div>
      )}
    </Card>
  );
}

export default FreelancerProposalsCard;
