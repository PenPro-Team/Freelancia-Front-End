import React, { useEffect, useState } from "react";
import "react-bootstrap";
import "react-popper";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import Rate_Stars from "../Rate_Stars";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import persImg from "../../assets/hero-bg.jpg";

export default function Sidebar() {
  const [data, setData] = useState([]);
  const state = useSelector((state) => state.auth);
  const user = state ? state.user : null;
  const isAuth = state ? state.isAuthenticated : null;
  console.log("User: ", user);
  useEffect(() => {
    axios
      .get(`https://api-generator.retool.com/SHY6hX/projects`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) =>
        console.error("There was an error fetching data", error)
      );
  }, []);

  const uniqueSkills = [
    ...new Set(data.flatMap((project) => project.required_skills || [])),
  ];

  return (
    <>
      <div
        className="position-sticky d-flex justify-content-center flex-wrap d-none d-lg-flex"
        style={{ top: "10rem" }}
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
          <div className="d-flex row p-3 rounded-4 bg-primary-subtle mb-3 w-100  justify-content-start">
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
              </div>
            </div>
            <div className="text-muted text-center ">
              <Rate_Stars rating="2" />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="border border-1 bg-primary-subtle p-3 rounded-4 mb-3 w-100">
          {uniqueSkills.length > 0 ? (
            uniqueSkills.map((skill, index) => (
              <InputGroup className="mb-3" key={index}>
                <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                <Form.Control
                  aria-label="Text input with checkbox"
                  placeholder={skill}
                />
              </InputGroup>
            ))
          ) : (
            <p>No skills available</p>
          )}
        </div>
      </div>
    </>
  );
}
