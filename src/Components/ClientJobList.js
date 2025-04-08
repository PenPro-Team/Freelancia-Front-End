import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import JobDetailsCard from "./JobDetailsCard";
import { useNavigate } from "react-router-dom";
import { AxiosProjectsInstance } from "../network/API/AxiosInstance";
import { Spinner } from "react-bootstrap";

const ClientJobList = ({ userId }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updateAPI, setUpdateAPI] = useState(false);

  function toPostalJob() {
    navigate("/Freelancia-Front-End/postjob");
  }

  const toggleCallingAPI = () => {
    setUpdateAPI(!updateAPI);
  };

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);

    const fetchProjects = async () => {
      try {
        console.log("Fetching projects for user ID:", userId);

        // Ensure correct endpoint format
        const response = await AxiosProjectsInstance.get(`/user/?owner_id=${userId}`);

        // Validate data structure
        if (Array.isArray(response.data.results)) {
          setProjects(response.data.results);
        } else {
          console.error("Unexpected response format:", response.data);
          setErrorMessage("Invalid response format from server.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setErrorMessage(error.response?.data?.message || "Failed to fetch projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [userId, updateAPI]);

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : errorMessage ? (
        <div className="text-danger text-center">{errorMessage}</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {projects.length > 0 ? (
            projects.map((project) => (
              <JobDetailsCard
                key={project.id}
                project={project}
                showTitle={true}
                actionCB={toggleCallingAPI}
              />
            ))
          ) : (
            <div className="mx-auto">
              <p className="text-center text-danger fs-4">
                You Don't Have Any Jobs Yet
                <button
                  className="btn btn-primary mx-auto ms-2"
                  onClick={toPostalJob}
                >
                  Create a Job
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientJobList;
