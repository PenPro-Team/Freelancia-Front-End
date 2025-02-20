import { Button, Card, Image } from "react-bootstrap";
import RateStars from "./RateStars";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function FreelancerProposalsCard(props) {
  const history = useHistory();
  return (
    <Card key={props.proposal.id} className="mb-3">
      <Card.Body style={{ position: "relative" }}>
        <Card.Title>
          <div className="d-flex align-items-center">
            <Image
              src={props.proposal.user_image}
              roundedCircle
              alt={props.proposal.user_name}
              width={50}
              height={50}
              className="me-2"
            />
            <div className="d-flex flex-column">
              <div>{props.proposal.user_name}</div>
              <div className="text-muted">
                <RateStars rating={props.proposal.user_rate} />
              </div>
            </div>
          </div>
        </Card.Title>
        <div className="mt-2">
          <span className="fw-bold">Deadline: </span>
          {props.proposal.deadline}
        </div>
        <div className="fw-bold">Propose Message:</div>
        <div>{props.proposal.propose_text}</div>
        {props.proposal.creation_date && (
          <div>
            <span
              className="text-secondary small fw-bold"
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
              }}
            >
              {props.proposal.creation_date}
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
                history.push(
                  `/Freelancia-Front-End/job_details/${props.proposal.project_id}`
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
              history.push(
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
