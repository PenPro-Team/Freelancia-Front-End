// `https://api-generator.retool.com/6wGsbQ/projects?owner_id=${user.id}`


// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import storge from "../network/local/LocalStorage"
// const ClientJobList = () => {

//   return (
//     <>
      
//     </>
//   );
// };

// export default ClientJobList;

import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import Job_Details_Card from '../Components/Job_Details_Card';


const ClientJobList = ({ userId }) => {
  userId = 2
  
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`https://api-generator.retool.com/6wGsbQ/projects?owner_id=${userId}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProjects();
  }, [userId]);

  return (
    <div className="d-flex flex-column gap-3">
      {projects.map((project) => (
        <Job_Details_Card key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ClientJobList;


