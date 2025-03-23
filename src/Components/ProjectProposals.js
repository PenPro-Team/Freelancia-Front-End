import { Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AxiosProposalsInstance } from "../network/API/AxiosInstance";
import FreelancerProposalsCard from "./FreelancerProposalsCard";

function ProjectProposals(props) {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    setIsLoading(true);
    console.log("Calling API");
    console.log("Project ID: ", props.project_id);
    AxiosProposalsInstance.get(`/project/${props.project_id}`)
      .then((res) => {
        setProposals(res.data);
        if (Object.keys(res.data).length) {
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.project_id, props.proposals_refresh]);

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
            <FreelancerProposalsCard
              proposal={proposal}
              showBtn={false}
              key={proposal.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectProposals;
