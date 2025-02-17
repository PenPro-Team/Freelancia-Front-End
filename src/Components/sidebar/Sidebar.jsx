import React, { useEffect, useState } from "react";
import "react-bootstrap";
import "react-popper";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import Rate_Stars from "../Rate_Stars";
import { Image, Placeholder } from "react-bootstrap";
import { useSelector } from "react-redux";
import persImg from "../../assets/hero-bg.jpg";
import FilterSkills from "../FilterJobs/FilterSkills";
import JobStateFilter from "../FilterJobs/JobStateFilter";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import PriceRangeFilter from "../FilterJobs/PriceRangeFilter";


export default function Sidebar(props) {
  const auth = getFromLocalStorage("auth");
  // const state = useSelector((state) => state.auth);
  const user = auth ? auth.user : null;
  const isAuth = auth ? auth.isAuthenticated : null;
  // const [priceRange, setPriceRange] = useState({ min:0, max :9999  });
  
  return (
    <>
      <div
        className="position-sticky d-flex justify-content-center flex-wrap d-none d-lg-flex"
        style={{ top: "5rem" }}
      >
        {/* <div className="d-flex row p-3 rounded-4 bg-primary-subtle mb-3 w-100  justify-content-start">
          <div className="col-6 col-lg-3 d-flex">
            <img
              src="https://www.upwork.com/profile-portraits/c1h_Fuv4ZIYmOf5A1oUEU5JcUr6pB1LzbnEdHvcWnBB5tGUIWZa4GJHpDTrc0CuzUZ"
              alt="Profile Picture"
              className="rounded-circle"
            />
          </div>
          <div className="col-md-6 col-lg-9 d-flex align-items-center flex-wrap ">
            <p className="h5">Abdelrahman Teleb</p>
            <p className="h5">Web Developer</p>
          </div>
        </div> */}

        {isAuth ? (
          <div className="d-flex row p-3 rounded-4 bg-primary-subtle mb-3 w-100">
            <div className="d-flex align-items-center">
              <Image
                src={persImg}
                roundedCircle
                alt="aa"
                width={64}
                height={64}
                className="me-2"
              />
              <div className="d-flex flex-column">
                <div className="fw-bold fs-3">{user.firstName}</div>
                <p className="fs-6 text-muted">Full stack developer</p>
              <div className="text-muted">
                <Rate_Stars rating="2" />
              </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
         className="border border-1 bg-primary-subtle p-3 rounded-4 mb-3 w-100"
         >

        <h6 className="mb-3">Filter Based On Skill Matching</h6>
          <FilterSkills skillCb={props.selectSkillCb}/>
        </div>
        <div 
        className="border border-1 bg-primary-subtle p-3 rounded-4 mb-3 w-100"
        >
          <h6 className="mb-3">Filter Based On Job States</h6>
          <JobStateFilter cb={props.selectedJobCb} />
        </div>
        <div className="mt-3 border border-1 bg-primary-subtle p-3 rounded-4 mb-3 w-100">
            <h6>Filter by Price Range</h6>
            <PriceRangeFilter onChange={props.setPriceRange} />
          </div>
      </div>
    </>
  );
}
