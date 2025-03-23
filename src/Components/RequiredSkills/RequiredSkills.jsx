import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Badge from "react-bootstrap/Badge";

export default function RequiredSkills(props) {
  let [skills, setSkills] = useState([]);

  useEffect(() => {
    if (Array.isArray(props.skills)) {
      setSkills(props.skills);
    } else {
      setSkills([props.skills]);
    }
  }, []);

  const required = [skills];
  return (
    <>
      <h1>22222</h1>
      {skills.map((skill) => (
        <Badge key={skill} bg="primary">
          {skill}
        </Badge>
      ))}
    </>
  );
}
