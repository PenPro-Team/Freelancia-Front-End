import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";
import axios from "axios";
import RequiredSkills from "../RequiredSkills/RequiredSkills";
import PaginationButton from "../Pagination/Pagination";
import Placeholder from "react-bootstrap/Placeholder";
import { Badge } from "react-bootstrap";
import { AxiosProjectsInstance } from "../../network/API/AxiosInstance";
import DrawSkills from "../DrawSkills";

export default function ProjectCard({
  skills,
  jobStates,
  priceRange,
  isSortedByRecent,
}) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchResult, setSearchResult] = useState();
  useEffect(() => {
    AxiosProjectsInstance.get(``)
      .then((response) => {
        const totalCount = response.data.length;
        setTotalPages(Math.ceil(totalCount / 10 + 1));
      })
      .catch((error) =>
        console.error("There was an error fetching data", error)
      );
  }, []);
  useEffect(() => {
    AxiosProjectsInstance.get(`?_page=${currentPage}&_limit=10`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) =>
        console.error("There was an error fetching data", error)
      );
  }, [currentPage]);

  useEffect(() => {
    const filtered = data.filter((project) => {
      let skillsMatch = true;
      if (skills.length > 0) {
        const projectSkills = Array.isArray(project.required_skills)
          ? project.required_skills
          : typeof project.required_skills === "string"
          ? project.required_skills.split(",").map((skill) => skill.trim())
          : [];
        skillsMatch = projectSkills.some((skill) => skills.includes(skill));
      }

      let jobStateMatch = true;
      if (jobStates && jobStates.length > 0) {
        jobStateMatch = jobStates.includes(project.project_state);
      }

      const price = project.suggested_budget || 0;

      let priceMatch = true;
      if (priceRange) {
        priceMatch = price >= priceRange.min && price <= priceRange.max;
      }
      // console.log("Price:", price, "Range:", priceRange);
      // console.log("Skills match:", skillsMatch, "Job state match:", jobStateMatch, "Price match:", priceMatch);
      return skillsMatch && jobStateMatch && priceMatch;
    });

    if (isSortedByRecent) {
      const sortedFiltered = [...filtered].sort(
        (old, now) => new Date(now.creation_date) - new Date(old.creation_date)
      );
      setFilteredData(sortedFiltered);
    } else {
      setFilteredData(filtered);
    }
  }, [data, skills, jobStates, priceRange, isSortedByRecent]);

  return (
    <>
      {filteredData.length > 0 && data.length > 0 ? (
        filteredData.map((project) => (
          <Link
            to={`/Freelancia-Front-End/job_details/${project.id}`}
            key={project.id}
            className="text-decoration-none"
          >
            <div className="card mb-3">
              <div className="card-body">
                <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
                  Price: {project.suggested_budget}$
                </p>
                <h5 className="card-title d-flex justify-content-between">
                  {project.project_name}{" "}
                  <span className="">
                    <p
                      className="mb-1 text-muted fw-light text-end d-inline"
                      style={{ fontSize: "12px" }}
                    >
                      {project.creation_date}
                    </p>
                  </span>
                </h5>

                {/* <RequiredSkills
                  skills={project.required_skills}
                  key={project.id}
                /> */}
                <DrawSkills required_skills={project.required_skills} />
                <Badge
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    opacity: "75%",
                  }}
                  bg={
                    project.project_state === "finished"
                      ? "dark"
                      : project.project_state === "open"
                      ? "primary"
                      : project.project_state === "ongoing"
                      ? "success"
                      : project.project_state === "canceled"
                      ? "danger"
                      : project.project_state === "contract canceled and reopened"
                      ? "success"
                      : "secondary"
                  }
                >
                  {project.project_state}
                </Badge>
                <p className="card-text truncate">
                  {project.project_description}
                </p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div>
          <Placeholder xs={6} />
          <Placeholder className="w-75" />
          <Placeholder style={{ width: "25%" }} />
        </div>
      )}
      <PaginationButton
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}
