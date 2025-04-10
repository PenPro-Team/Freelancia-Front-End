import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Button, Form, Alert } from "react-bootstrap";
import Cards from "../Components/Cards";
import proImages from "../assets/default-user.png";
import defaultUserImage from "../assets/default-user.png";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AxiosFreelancersInstance, AxiosClientsInstance, AxiosUserSearchInstance } from "../network/API/AxiosInstance";
import RateStars from "../Components/RateStars";
import { BASE_PATH } from "../network/API/AxiosInstance";
import { useTranslation } from 'react-i18next';
import freelancia from "../assets/freelancia.gif";
import { getFromLocalStorage } from "../network/local/LocalStorage";
function Home() {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null; 
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [searchType, setSearchType] = useState("all"); // State to track search type: "all", "freelancers", or "clients"
  const [hasSearched, setHasSearched] = useState(false); // Track if a search was performed

  const navigate = useNavigate(); // Hook for navigation
  const { t } = useTranslation();

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

  // Handle search for both freelancers and clients by username
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission

    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setHasSearched(false); // No search was performed
      return;
    
    }

    let results = [];
    const query = searchQuery.toLowerCase();
    AxiosUserSearchInstance.get(`?search=${query}&role=${searchType}`).then((res) => {
      setSearchResults(res.data.results);
      setHasSearched(true); // Search was performed
    }
    ).catch((error) => {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setHasSearched(false); // No search was performed
    })


   };

  // Defult Image Function
  const getUserImage = (user) => {
    // First try to use user.image if available
    if (user.image && user.image !== 'null' && user.image !== 'undefined') {
      return user.image;
    }
    // Then try proImages if available
    if (proImages) {
      return proImages;
    }
    // Finally fall back to default user image
    return defaultUserImage;
  };

  // Render search result card based on user type
  const renderSearchResultCard = (user, idx) => {
    return (
      <Col key={idx} xs={12} md={6} lg={4} className="mb-4">
        <Card
          className="h-100 shadow-sm border-light"
          onClick={() => navigate(`${BASE_PATH}/Dashboard/${user.id}`)}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            borderRadius: "8px",
            overflow: "hidden"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
          }}
        >
          <Card.Img
            variant="top"
            src={getUserImage(user)}
            alt={user.name || user.username}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <Card.Body className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Card.Title className="mb-0 fw-bold">{user.name || user.username}</Card.Title>
              <div className={`badge ${user.userType === 'freelancer' ? 'bg-primary' : 'bg-success'} text-white`}>
                {user.role === 'freelancer' ? 'Freelancer' : 'Client'}
              </div>
            </div>
            <div className="mb-2">
              <RateStars rating={user.rate} />
            </div>
            <Card.Text className="text-secondary">
              <strong>Description:</strong>{" "}
              {user.description
                ? (user.description.length > 100
                  ? `${user.description.substring(0, 100)}...`
                  : user.description)
                : "No description available."}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  // Function to render search results section with message if no results found
  const renderSearchResults = () => {
    if (!hasSearched) return null;

    return (
      <div className="mb-5">
        <h3 className="fw-bold mb-4 border-bottom pb-2">{t('home.search.button')}</h3>

        {searchResults.length > 0 ? (
          <Row>
            {searchResults.map((result, idx) => renderSearchResultCard(result, idx))}
          </Row>
        ) : (
          <Alert variant="danger" className="text-center">
            <i className="bi bi-search me-2"></i>
            No users found matching "{searchQuery}" in {searchType === "all" ? "freelancers or clients" : searchType}.
            <p className="mt-2 mb-0">Try a different search term or category.</p>
          </Alert>
        )}
      </div>
    );
  };
  
  return (
    <Container className="py-4">
      <Row className="mb-5 py-3 bg-light rounded shadow-sm align-items-center">
        <Col xs={12} md={7} className="p-4">
          <h2 className="fw-bold mb-3">{t('home.welcome')}</h2>
          <p className="fs-5 text-secondary mb-4">{t('home.subtitle')}</p>

          <Form onSubmit={handleSearch} className="mb-4">
            <Row className="g-2">
              <Col xs={12} md={8}>
                <Form.Control
                  type="text"
                  placeholder={t('home.search.placeholder')}
                  className="border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Col>
              <Col xs={6} md={2}>
                <Form.Select
                  className="border-primary"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="freelancer">Freelancers</option>
                  <option value="client">Clients</option>
                </Form.Select>
              </Col>
              <Col xs={6} md={2}>
                <Button type="submit" variant="primary" className="w-100" onClick={handleSearch}>
                  {t('home.search.button')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col xs={12} md={5} className="text-center">
          <img
            className="img-fluid rounded"
            src ={freelancia}
            alt="Freelance Platform"
            style={{ maxHeight: "300px" }}
          />
        </Col>
      </Row>

      {/* Search Results Section */}

      {/* Search Results Section with potential "No results" message */}
      {renderSearchResults()}

      {/* Clients Section */}
      <div className="mb-5 py-4 bg-light rounded shadow-sm">
        <h3 className="fw-bold mb-4 text-center">{t('home.clients.title')}</h3>
        <Row className="align-items-center">
          <Col xs={12} md={7} className="mb-4 mb-md-0">
            <Row className="g-3">
              {clients.slice(0, 4).map((client, idx) => (
                <Col key={idx} xs={6} className="text-center">
                  <div
                    className="position-relative rounded shadow-sm overflow-hidden"
                    onClick={() => navigate(`${BASE_PATH}/Dashboard/${client.id}`)}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
                    }}
                  >
                    <img
                      className="img-fluid w-100"
                      src={getUserImage(client)}
                      alt={`Client ${idx + 1}`}
                      style={{ aspectRatio: "7/8", objectFit: "cover" }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col xs={12} md={5} className="text-center text-md-start px-4">
            <h4 className="fw-bold mb-3">
              {t('home.clients.subtitle')}
            </h4>
            <Button
              onClick={() => navigate(`${BASE_PATH}/Job_List`)}
              variant="info"
              className="text-white fw-semibold"
            >
              {t('home.clients.viewProjects')}
            </Button>
          </Col>
        </Row>
      </div>

      {/* Freelancers Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h3 className="fw-bold mb-0">{t('home.freelancers.title')}</h3>
          
        </div>
        <Row className="g-4">
          {freelancers.slice(0, 6).map((freelancer, idx) => (
            <Col key={idx} xs={12} md={6} lg={4}>
              <Card
                className="h-100 shadow-sm border-light"
                onClick={() => navigate(`${BASE_PATH}/Dashboard/${freelancer.id}`)}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
                }}
              >
                <Card.Img
                  variant="top"
                  src={getUserImage(freelancer)}
                  alt={freelancer.username}
                  // style={{ height: "100%",width:"60%", objectFit: "fit" }}
                  style={{ aspectRatio: "1/1", objectFit: "cover" }}
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="mb-0 fw-bold">{freelancer.username}</Card.Title>
                    <div className="badge bg-light text-dark">
                      {freelancer.category || "Freelancer"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <RateStars rating={freelancer.rate} />
                  </div>
                  <Card.Text className="text-secondary">
                    <strong>Description:</strong>{" "}
                    {freelancer.description
                      ? (freelancer.description.length > 100
                        ? `${freelancer.description.substring(0, 100)}...`
                        : freelancer.description)
                      : "No description available."}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Sections */}
      {!user ? (
        <div className="text-center py-4 my-5 bg-primary text-white rounded shadow">
          <h3 className="fw-bold mb-3">{t('home.cta.title')}</h3>
          <p className="mb-4">{t('home.cta.subtitle')}</p>
          <Button
            variant="light"
            className="fw-semibold me-2"
            onClick={() => navigate(`${BASE_PATH}/register`)}
          >
            {t('home.cta.signup')}
          </Button>
          <Button
            variant="outline-light"
            onClick={() => navigate(`${BASE_PATH}/Job_List`)}
          >
            {t('home.cta.browse')}
          </Button>
        </div>
      ) : (
        <div className="text-center py-4 my-5 bg-light rounded shadow">
          <h3 className="fw-bold mb-3">{t('home.cta.loggedIn.title')}</h3>
          <p className="mb-4">{t('home.cta.loggedIn.subtitle')}</p>
          <Button
            variant="primary"
            className="fw-semibold me-2"
            onClick={() => navigate(`${BASE_PATH}/Job_List`)}
          >
            Browse Projects
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate(`${BASE_PATH}/Dashboard/${user?.user_id}`)}
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </Container>
  );
}

export default Home;