import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import JobDetailsCard from "./JobDetailsCard";
import { useNavigate } from "react-router-dom"; // Updated to useNavigate
import { AxiosProjectsInstance } from "../network/API/AxiosInstance";
import { Spinner } from "react-bootstrap";

const ClientJobList = ({ userId }) => {
  const navigate = useNavigate(); // Updated to use useNavigate
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [updataAPI, setUpdateAPI] = useState(false);

  function toPostalJob() {
    navigate("/Freelancia-Front-End/postjob"); // Updated to use navigate
  }

  const toggleCallingAPI = () => {
    console.log("Calling Toggle Updating");
    setUpdateAPI(!updataAPI);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchProjects = async () => {
      try {
        const response = await AxiosProjectsInstance.get(`?owner_id=${userId}`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [userId, updataAPI]);

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="text-primary">No proposals found ...</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {projects.length >= 1 ? (
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
