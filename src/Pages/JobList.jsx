import React, { useState } from "react";
import Projects from "../Components/Projects/Projects";
import "react-bootstrap";
import "react-popper";
import Sidebar from "../Components/sidebar/Sidebar";

export default function JobList(props) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJobStates, setSelectedJobStates] = useState([]);

  const handleSelectedStates = (value) => {
    console.log("main handle states: ", value);
    setSelectedJobStates(value);
  };

  const handleChangeSkill = (value) => {
    console.log("selected skills: ", value);
    setSelectedSkills(value);
  };
  return (
    <>
      <div className="container-fluid position-relative">
        <div className="row">
          <div className="col-12 col-lg-7">
          <Projects skills={selectedSkills} jobStates={selectedJobStates} />
          </div>
          <div className="col-lg-4 p-3">
            <Sidebar selectSkillCb={handleChangeSkill} selectedJobCb={handleSelectedStates}/>
          </div>
        </div>
      </div>
    </>
  );
}
