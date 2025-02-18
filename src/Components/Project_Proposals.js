import axios from "axios";
import { Card, CardText, Image, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Rate_Stars from "./Rate_Stars";
import { AxiosProposalsInstance } from "../network/API/AxiosInstance";

function Project_Proposals(props) {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //  location history match
  const params = useParams();
  useEffect(() => {
    setIsLoading(true);
    AxiosProposalsInstance.get(`?project_id=${params.project_id}`)
      .then((res) => {
        setProposals(res.data);
        setError(false);
        if (Object.keys(res.data).length) {
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="text-primary">No proposals found ...</div>
      ) : (
        <div>
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="mb-3">
              <Card.Body style={{ position: "relative" }}>
                <Card.Title>
                  <div className="d-flex align-items-center">
                    <Image
                      src={proposal.user_image}
                      roundedCircle
                      alt={proposal.user_name}
                      width={50}
                      height={50}
                      className="me-2"
                    />
                    <div className="d-flex flex-column">
                      <div>{proposal.user_name}</div>
                      <div className="text-muted">
                        <Rate_Stars rating={proposal.user_rate} />
                      </div>
                    </div>
                  </div>
                </Card.Title>
                {/* <Card.Subtitle className="mb-2 text-muted"> */}
                {/* <div className="mb-2">
                <Rate_Stars rating={proposal.user_rate} />
              </div> */}
                <div className="mt-2">
                  <span className="fw-bold">Deadline: </span>
                  {proposal.deadline}
                </div>
                {/* </Card.Subtitle> */}
                {/* <Card.Text> */}
                <div className="fw-bold">Propose Message:</div>
                <div>{proposal.propose_text}</div>
                {proposal.creation_date && (
                  <div>
                    <span
                      className="text-secondary small fw-bold"
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                      }}
                    >
                      {proposal.creation_date}
                    </span>
                  </div>
                )}
                {/* </Card.Text> */}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default Project_Proposals;
