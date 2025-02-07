import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./ProjectCard.css"
import axios from 'axios'
import RequiredSkills from '../RequiredSkills/RequiredSkills';
import PaginationButton from '../Pagination/Pagination';
import "react-popper"
import Placeholder from 'react-bootstrap/Placeholder';
import { DataProvider } from '../DataContext/DataContext';
import Sidebar from '../sidebar/Sidebar';

export default function ProjectCard() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(data.length)
    
    
    useEffect(() => {
        axios.get(`https://api-generator.retool.com/SHY6hX/projects?_page=${currentPage}&_limit=10`)
          .then(response => {
            setData(response.data);
            const totalCount = 60;
            setTotalPages(Math.ceil(totalCount / 10));
          })
          .catch(error => console.error("There was an error fetching data", error));
        }, [currentPage]);
        
        
        return (
    <>
      {data.length > 0 ? (
        data.map((project, index) => (
          <Link 
          to="#" 
          key={index} 
          className="text-decoration-none" 
          style={{ height: "50px" }}>
            <div className="card mb-3">
              <div className="card-body">
                <p className="mb-2 text-muted" 
                    style={{ fontSize: "14px" }}>Price : {project.suggested_budget}$
                </p>
                <h5 className="card-title">{project.project_name}</h5>
                <RequiredSkills 
                skills={project.required_skills} 
                key={project.required_skills}/>
                
                <p className="card-text truncate">{project.project_description}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div>
            <Placeholder xs={6} />
            <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
        </div>
      )}
      <PaginationButton
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}


