import React from "react";
import ProjectCard from "../project-card/ProjectCard";
import Search from "../Search/Search";
import FilterJobs from "../FilterJobs/FilterJobs";

export default function Projects(props) {
  console.log("projects file", props.skills);
  return (
    <>
      <div className="container">
        <div className="p-3">
          <div>
            <Search />
            <div>
              <FilterJobs />
              <ProjectCard 
              skills={props.skills} 
              jobStates={props.jobStates} 
              priceRange={props.priceRange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
