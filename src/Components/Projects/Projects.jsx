import React, { useState } from "react";
import ProjectCard from "../project-card/ProjectCard";
import Search from "../Search/Search";
import FilterJobs from "../FilterJobs/FilterJobs";

export default function Projects(props) {
  // console.log("projects file", props.skills);
  const [isSortedByRecent, setIsSortedByRecent] = useState(false)
  return (
    <>
      <div className="container">
        <div className="p-3">
          <div>
            <Search />
            <div>
              <FilterJobs onSortRecent={() => setIsSortedByRecent(!isSortedByRecent)} isSortedByRecent={isSortedByRecent}/>
              <ProjectCard 
              skills={props.skills} 
              jobStates={props.jobStates} 
              priceRange={props.priceRange}
              isSortedByRecent={isSortedByRecent}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
