import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
// import { useNavigate } from "react-router-dom/cjs/react-router-dom.min";
import { useNavigate } from "react-router-dom";
import { AxiosProposalsInstance } from "../network/API/AxiosInstance";
import { Button, Spinner } from "react-bootstrap";
import FreelancerProposalsCard from "../Components/FreelancerProposalsCard";
import HeaderColoredText from "../Components/HeaderColoredText";

function FreelancerProposals() {
  const auth = getFromLocalStorage("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [proposals, setProposals] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Here");
    console.log(auth);
    console.log(navigate);
    if (auth) {
      if (auth.isAuthenticated && auth.user) {
        if (auth.user.role === "freelancer") {
          const user_id = auth.user.user_id;
          console.log(user_id);
          setIsLoading(true);
          AxiosProposalsInstance.get(`?user=${user_id}`)
            .then((res) => {
              setProposals(res.data);
              console.log(res.data);
              console.log(user_id);

              if (Object.keys(res.data).length) {
                setIsEmpty(false);
              } else {
                setIsEmpty(true);
                // history.push("/Freelancia-Front-End/404");
              }
            })
            .catch((err) => {
              console.log(err);
              //history.push("/Freelancia-Front-End/404");
              setIsEmpty(true);
            })
            .finally(() => {
              setIsLoading(false);
            });
        } else {
          navigate("/Freelancia-Front-End/403");
        }
      } else {
        navigate("/Freelancia-Front-End/403");
      }
    } else {
      navigate("/Freelancia-Front-End/403");
    }
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <HeaderColoredText text="My Proposals" />
          <div>
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : !isEmpty ? (
              <div>
                {proposals.map((proposal) => (
                  <FreelancerProposalsCard
                    proposal={proposal}
                    key={proposal.id}
                    showBtn={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div>There're no proposals for you to view </div>
                <div>
                  {" "}
                  Make A New One {""}
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate("/Freelancia-Front-End/Job_List")
                    }
                  >
                    View Jobs
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerProposals;
