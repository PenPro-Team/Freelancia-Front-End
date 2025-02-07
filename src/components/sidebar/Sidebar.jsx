import React, { useEffect, useState } from 'react'
import "react-bootstrap"
import "react-popper"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';


export default function Sidebar() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://api-generator.retool.com/SHY6hX/projects`)
          .then(response => {
            setData(response.data);
          })
          .catch(error => console.error("There was an error fetching data", error));
      },[]);

      const uniqueSkills = [
        ...new Set(data.flatMap(project => project.required_skills || []))
      ];


  return (
    <>    
      <div className='position-sticky d-flex justify-content-center flex-wrap d-none d-lg-flex' style={{ top: "10rem"}}>

        <div className='row p-3 rounded-4 bg-primary-subtle mb-3 w-100'>
          <div className='col-6 d-flex justify-content-end'>
            <img 
              src="https://www.upwork.com/profile-portraits/c1h_Fuv4ZIYmOf5A1oUEU5JcUr6pB1LzbnEdHvcWnBB5tGUIWZa4GJHpDTrc0CuzUZ" 
              alt="Profile Picture"
              className='rounded-circle'
            />
          </div>
          <div className='col-6 d-flex align-items-center flex-wrap '>
            <p className='h5'>Abdelrahman Teleb</p>
            <p className='h5'>Web Developer</p>
          </div>
        </div>

        <div className='border border-1 bg-primary-subtle p-3 rounded-4 mb-3 w-100'>
          {uniqueSkills.length > 0 ? (
            uniqueSkills.map((skill, index) => (
              <InputGroup className="mb-3" key={index}>
                <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                <Form.Control aria-label="Text input with checkbox" placeholder={skill} />
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
