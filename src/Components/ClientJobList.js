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
import Job_Details_Card from './Job_Details_Card';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { AxiosProjectsInstance } from '../network/API/AxiosInstance';
import { Spinner } from 'react-bootstrap';

// const ClientJobList = ({ userId }) => {
//   // userId = 2
//  const History = useHistory()
  
// const [projects, setProjects] = useState([]);

// function toPostalJob(){
//   History.push("/Freelancia-Front-End/postjob")
// }


//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await axios.get(`https://api-generator.retool.com/6wGsbQ/projects?owner_id=${userId}`);
//         setProjects(response.data);
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     fetchProjects();
//   }, [userId]);

//   return (
//     <div className="d-flex flex-column gap-3">
//       {
//         projects.length >= 1 ? projects.map((project) => (
//           <Job_Details_Card key={project.id} project={project} />
//         )) : <div className='mx-auto'><p className='text-center text-danger fs-4'>You Don't Have Any Jobs Yet
//                   <button className='btn btn-primary mx-auto ms-2' onClick={toPostalJob}>Create a Job</button>
//                 </p>
//              </div>
//       }
//     </div>
//   );
// };

// export default ClientJobList;

const ClientJobList = ({ userId }) => {

  // userId = 1
  const history = useHistory();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  function toPostalJob() {
    history.push("/Freelancia-Front-End/postjob");
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchProjects = async () => {
      try {
        const response = await AxiosProjectsInstance.get(`?owner_id=${userId}`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error:', error);
        setError(true); // Make sure you have an error state
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProjects();
  }, [userId]);
  

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="text-primary">No proposals found ...</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {projects.length >= 1 ? (
            projects.map((project) => (
              <Job_Details_Card key={project.id} project={project} />
            ))
          ) : (
            <div className='mx-auto'>
              <p className='text-center text-danger fs-4'>
                You Don't Have Any Jobs Yet
                <button className='btn btn-primary mx-auto ms-2' onClick={toPostalJob}>
                  Create a Job
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
  

};

export default ClientJobList;
