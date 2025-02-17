import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, InputGroup, Placeholder } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

export default function JobStateFilter({ cb }) {
  const [data, setData] = useState([]);
  const history = useHistory();
  const params = useParams();
  const [selectedJobStates, setSelectedJobStates] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api-generator.retool.com/SHY6hX/projects/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) =>
        console.error("There was an error fetching data", error)
      );
  }, []);

  // Here, we assume job_state is stored as a string on each project.
  // We filter out any falsey values.
  const uniqueJobStates = [
    ...new Set(data.map((project) => project.job_state).filter(Boolean)),
  ];

  const handleChange = (e) => {
    const jobState = e.target.id;
    const isChecked = e.target.checked;

    setSelectedJobStates((prevJobStates) => {
      const updatedJobStates = isChecked
        ? [...prevJobStates, jobState]
        : prevJobStates.filter((s) => s !== jobState);

      // Call the callback with the updated states.
      cb(updatedJobStates);
      return updatedJobStates;
    });
  };

  return (
    <>
      {uniqueJobStates.length > 0 ? (
        uniqueJobStates.map((jobState, index) => (
          <InputGroup
            className="mb-3 bg-light-subtle w-100 rounded-3 py-2 px-3 text-dark-emphasis"
            key={index}
          >
            <Form.Check
              type="checkbox"
              id={jobState}
              label={jobState}
              style={{ paddingRight: "5px" }}
              onChange={handleChange}
              checked={selectedJobStates.includes(jobState)}
            />
          </InputGroup>
        ))
      ) : (
        <div>
          <Placeholder xs={6} />
          <Placeholder className="w-75" />
          <Placeholder style={{ width: "25%" }} />
        </div>
      )}
    </>
  );
}
