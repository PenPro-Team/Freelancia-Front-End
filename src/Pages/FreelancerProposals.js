import { useEffect, useState } from "react";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { AxiosProposalsInstance } from "../network/API/AxiosInstance";
import { Button, Spinner } from "react-bootstrap";
import FreelancerProposalsCard from "../Components/FreelancerProposalsCard";
import HeaderColoredText from "../Components/HeaderColoredText";

function FreelancerProposals() {
  const auth = getFromLocalStorage("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [proposals, setProposals] = useState([]);
  const history = useHistory();
  useEffect(() => {
    console.log("Here");
    console.log(auth);
    console.log(history);
    if (auth) {
      if (auth.isAuthenticated && auth.user) {
        if (auth.user.role === "freelancer") {
          const user_id = auth.user.id;
          console.log(user_id);
          setIsLoading(true);
          AxiosProposalsInstance.get(`?user_id=${user_id}`)
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
          history.push("/Freelancia-Front-End/403");
        }
      } else {
        history.push("/Freelancia-Front-End/403");
      }
    } else {
      history.push("/Freelancia-Front-End/403");
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
              <div>
                <div>There're no proposals for you to view </div>
                <div>
                  {" "}
                  Make A New One
                  <Button
                    variant="primary"
                    onClick={() =>
                      history.push("/Freelancia-Front-End/Job_List")
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
