import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";
import axios from "axios";
import RequiredSkills from "../RequiredSkills/RequiredSkills";
import PaginationButton from "../Pagination/Pagination";
import Placeholder from "react-bootstrap/Placeholder";

export default function ProjectCard({ skills, jobStates }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchResult, setSearchResult] = useState()
  useEffect(() => {
    console.log("Selected Skills:", skills, "Selected Job States:", jobStates);
    axios
      .get(
        `https://api-generator.retool.com/SHY6hX/projects?_page=${currentPage}&_limit=10`
      )
      .then((response) => {
        setData(response.data);
        const totalCount = 60;
        setTotalPages(Math.ceil(totalCount / 10));
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
        jobStateMatch = jobStates.includes(project.job_state);
      }

      return skillsMatch && jobStateMatch;
    });
    setFilteredData(filtered);
  }, [data, skills, jobStates]);

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
                <p className="mb-2 text-muted" style={{ fontSize: "14px" }}>
                  Price: {project.suggested_budget}$
                </p>
                <h5 className="card-title">{project.project_name}</h5>
                <RequiredSkills
                  skills={project.required_skills}
                  key={project.id}
                />
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
