import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import Job_Details_Card from "../Components/Job_Details_Card";
import Client_Details_Card from "../Components/Client_Details_Card";
import Propose_Card from "../Components/Propose_Card";
import { useSelector } from "react-redux";

function Job_Details() {
  const [project, setProject] = useState({});
  const user = useSelector((state) => state.auth.user);
  //  location history match
  const params = useParams();
  useEffect(() => {
    axios
      .get(
        `https://api-generator.retool.com/6wGsbQ/projects/${params.project_id}`
      )
      .then((res) => {
        setProject(res.data);
        console.log(res.data);
        console.log(params.project_id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const hello = (value) => {
    console.log("hello", value);
  };
  return (
    <>
      <div className="fs-1 fw-bold text-center m-3">{project.project_name}</div>
      <div>
        <div className="d-flex flex-row flex-wrap gap-3 justify-content-center m-2 mb-5">
          <div className="col-lg-8 col-md-7 col-sm-12 col-12">
            <Job_Details_Card project={project} />
          </div>
          <div className="col-lg-3 col-md-4 col-sm-8 col-9">
            <Client_Details_Card project={project} />
          </div>
        </div>
        {["open", "contract canceled and reopened"].includes(
          project.job_state
        ) && (
          <div>
            <Propose_Card
              project_id={project.id}
              user={user}
              disabled={
                !["open", "contract canceled and reopened"].includes(
                  project.job_state
                )
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
export default Job_Details;
