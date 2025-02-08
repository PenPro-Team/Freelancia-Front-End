import React from "react";
import Projects from "../Components/Projects/Projects";
import "react-bootstrap";
import "react-popper";
import Sidebar from "../Components/sidebar/Sidebar";

export default function JobList(project) {
  return (
    <>
      <div className="container-fluid position-relative">
        <div className="row">
          <div className="col-12 col-lg-7">
            <Projects />
          </div>
          <div className="col-lg-4 p-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}
