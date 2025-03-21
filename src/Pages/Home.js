import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import proImage from "../assets/hero-image--popular-items-2963d5759f434e6691a0bb5363bf2d1707c8885ab10b6dba3b0648f8c5f94da5.webp";
import { Button, Form } from "react-bootstrap";
import Cards from "../Components/Cards";
import Btn from "../Components/Btn";
import proImages from "../assets/hero-bg.jpg";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AxiosFreelancersInstance, AxiosClientsInstance } from "../network/API/AxiosInstance";
import RateStars from "../Components/RateStars";
import { BASE_PATH } from "../network/API/AxiosInstance";
function Home() {
  const user = useSelector((state) => state.auth.user);
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results

  const navigate = useNavigate(); // Hook for navigation

  console.log("Logged in User:", user);

  // Fetch highest-rated freelancers
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await AxiosFreelancersInstance.get("highest-rated/");
        setFreelancers(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      }
    };

    fetchFreelancers();
  }, []);

  // Fetch highest-rated clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await AxiosClientsInstance.get("highest-rated/");
        setClients(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Handle search for freelancers by username
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    if (searchQuery.trim() === "") {
      setSearchResults([]); // Clear search results if the query is empty
      return;
    }

    // Filter freelancers by username
    const results = freelancers.filter((freelancer) =>
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results); // Update search results
  };

  return (

    <Container className="text-center text-lg-start">

      {/* Header Section */}
      <Row>
        <Col xs={10} md={6} className="d-flex align-content-center flex-wrap">
          <div>
            <h2>
              Welcome to <span className="text-primary">FreeLancia</span> where
              your Business Dream Can Be Real
            </h2>
          </div>
          <p className="fs-5">
            Discover the world of Freelance and Make Your Dreams Real
          </p>

          <Row className="mx-auto mb-4">
            <Col xs="auto">
              <Form onSubmit={handleSearch}>
                <Form.Control
                  type="text"
                  placeholder="Search by username"
                  className="mr-sm-2 w-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form>
            </Col>
            <Col xs="auto" className="d-none d-lg-inline">
              <Button type="submit" onClick={handleSearch}>
                Search
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={4} md={2}>
          <img width={"350%"} src={proImage} alt="Freelance Platform" />
        </Col>
      </Row>

      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <Row className="mt-4">
          <h3>Search Results</h3>
          {searchResults.map((freelancer, idx) => (
            <Col key={idx} xs={12} md={6} lg={4} className="mb-4">
              <Card
                className="shadow-lg"
                onClick={() => navigate(`${BASE_PATH}/Dashboard/${freelancer.id}`)}

                style={{ cursor: "pointer" }}
              >
                <Card.Img
                  variant="top"
                  src={freelancer.image || proImages}
                  alt={freelancer.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>
                    {freelancer.name}
                    <br />
                    <RateStars rating={freelancer.rate} />
                  </Card.Title>
                  <Card.Text>
                    <strong>Description:</strong>{" "}
                    {freelancer.description || "No description available."}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Highlighted Cards Section */}
      <div className="d-flex flex-wrap row row-cols-1 row-cols-md-3 g-3 ms-1 mt-2 mb-4 justify-content-center align-items-center">
        <Cards
          title={"WordPress Themes"}
          pragraph={"Email, newsletter and landing page."}
        />
        <Cards
          title={"eCommerce Templates"}
          pragraph={"Over 1,700 CMS website templates"}
        />
        <Cards
          title={"Website Templates"}
          pragraph={"Blogger templates and themes"}
        />
      </div>

      {/* Clients Section */}
      <Row>
        <Col xs={10} md={6} className="d-flex align-content-center flex-wrap">
          <div className="divhit g-1">
            {clients.slice(0, 4).map((client, idx) => (
              <img
                key={idx}
                width={"50%"}
                className="rounded"
                src={client.image}
                alt={`Client ${idx + 1}`}
                onClick={() => navigate(`${BASE_PATH}/Dashboard/${client.id}`)}
                style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
              />
            ))}
          </div>
        </Col>
        <Col xs={6} md={4} className="d-flex align-content-center flex-wrap">
          <h2 className="text-center text-lg-start">
            Unique themes and templates for every budget and every project.
          </h2>
          <Btn title={"View all Projects"} />
        </Col>
      </Row>

      {/* Top Rated Freelancers Section */}
      <div className="row mt-5">
        <div className="col-md-12">
          <Row xs={1} md={3} className="g-4">
            {freelancers.slice(0, 6).map((freelancer, idx) => (
              <Col key={idx}>
                <Card
                  className="shadow-lg"
                  onClick={() => navigate(`${BASE_PATH}/Dashboard/${freelancer.id}`)}

                  style={{ cursor: "pointer" }}
                >

                  <Card.Img
                    variant="top"
                    src={freelancer.image || proImages}
                    alt={freelancer.username}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>
                      {freelancer.username}
                      <br />
                      <RateStars rating={freelancer.rate} />
                    </Card.Title>
                    <Card.Text>
                      <strong>Description:</strong>{" "}
                      {freelancer.description || "No description available."}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

    </Container>

  );

}

export default Home;
