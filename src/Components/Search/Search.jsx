import React, { useState } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Placeholder } from 'react-bootstrap';



export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showResult,setShowResult] = useState(false)


  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setLoading(true);
    setSearched(true);

    axios.get('https://api-generator.retool.com/SHY6hX/projects')
      .then(response => {
        setShowResult(true)
        // const searchedResult = document.getElementById('searchedResult')
        // searchedResult.classList.remove("d-none")
        
        console.log(response.data);
        const filteredResults = response.data.filter(project =>
          project.required_skills && project.required_skills.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (filteredResults.length > 0) {
          setSearchResults(filteredResults);
        } else {
          setSearchResults([]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const CloseSearch = (e) => {
    console.log(e.target.parentElement);
    let searchParent = e.target.parentElement
    // searchParent.classList.add("d-none")
    setShowResult(false)
  }



  return (
    <>
      <div className='mb-5 '>
        <Form className="d-flex" onSubmit={handleSearch}>
          <InputGroup>
            <InputGroup.Text id="btnGroupAddon2" className='bg-primary '>
            <Button onClick={handleSearch}><i className="fa-solid fa-magnifying-glass text-light"></i></Button>
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="Search Jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Form>
      </div>

      {loading && <div>
            <Placeholder xs={6} />
            <Placeholder className="w-75" /> <Placeholder style={{ width: '25%' }} />
        </div>}
      
      {searched && searchResults.length > 0 ? (
        <div id='searchedResult' className={`border-2 border rounded-3 p-4 mb-4 position-relative ${showResult ? "d-block" : "d-none"}`}>
          <Button variant="dark" className='position-absolute top-0 end-0' onClick={(e) => CloseSearch(e)}>X</Button>
          <h4>Search Results:</h4>
            {searchResults.map((project) => (
               <Link
                          to={`/Freelancia-Front-End/job_details/${project.id}`}
                          key={project.id}
                          className="text-decoration-none"
                          style={{ height: "50px" }}
                        >
              <Card className='mb-3 h-50 border'>
              <Card.Header className='bg-primary-subtle'>{project.required_skills}</Card.Header>
              <Card.Body>
                <Card.Title>{project.project_name}</Card.Title>
                <Card.Text>
                  {project.project_description}
                </Card.Text>
              </Card.Body>
            </Card>
            </Link>
            ))}
        </div>
      ) : (
        searched && <h4>No results.</h4>
      )}
    </>
  );
}
