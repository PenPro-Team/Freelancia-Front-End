import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobDetailsCard from "../Components/JobDetailsCard";
import ClientDetailsCard from "../Components/ClientDetailsCard";
import ProposeCard from "../Components/ProposeCard";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { AxiosProjectsInstance } from "../network/API/AxiosInstance";
import { Placeholder } from "react-bootstrap";
import HeaderColoredText from "../Components/HeaderColoredText";

function JobDetails() {
  const [project, setProject] = useState({});

  const auth = getFromLocalStorage("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [proposals_refresh, setProposals_refresh] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    AxiosProjectsInstance.get(`/${params.project_id}`)
      .then((res) => {
        setProject(res.data);
        if (Object.keys(res.data).length) {
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
          navigate("/Freelancia-Front-End/404");
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/Freelancia-Front-End/404");
        setIsEmpty(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate, params.project_id]);

  const toggleProposals_refresh = () => {
    setProposals_refresh(!proposals_refresh);
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex flex-row flex-wrap justify-content-evenly align-items-center">
          <Placeholder xs={3} size="lg" className="m-2" />
        </div>
      ) : isEmpty ? (
        <div>
          <p className="text-center text-danger m-5 fs-1 fw-bold">
            Can't Find This Project
          </p>
        </div>
      ) : (
        <HeaderColoredText text={project.project_name} />
      )}
      <div className="" style={{ minHeight: "48vh" }}>
        <div className="d-flex flex-row flex-wrap gap-3 justify-content-center m-2 mb-5">
          <div className="col-lg-8 col-md-7 col-sm-12 col-12">
            {project && (
              <JobDetailsCard
                project={project}
                isLoading={isLoading}
                proposals_refresh={proposals_refresh}
              />
            )}
          </div>
          <div className="col-lg-3 col-md-4 col-sm-8 col-9">
            <ClientDetailsCard project={project} isLoading={isLoading} />
            {auth ? (
              auth.isAuthenticated &&
              auth.user.role === "freelancer" &&
              ["open", "contract canceled and reopened"].includes(
                project.project_state
              ) && (
                <div className="d-flex flex-row flex-wrap gap-3 justify-content-center mt-3">
                  <ProposeCard
                    project_id={project.id}
                    user={auth.user}
                    CB_proposals_refresh={toggleProposals_refresh}
                    disabled={
                      !["open", "contract canceled and reopened"].includes(
                        project.project_state
                      )
                    }
                  />
                </div>
              )
            ) : (
              <div
                className="d-none d-lg-block"
                style={{ height: "20vh" }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default JobDetails;
