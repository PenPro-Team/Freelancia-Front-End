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
import { AxiosFreelancersInstance, AxiosClientsInstance } from "../network/API/AxiosInstance"; // Import the new Axios instance
import RateStars from "../Components/RateStars";

function Home() {
  const user = useSelector((state) => state.auth.user);
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);

  console.log("Logged in User:", user);

  // Fetch highest-rated freelancers
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await AxiosFreelancersInstance.get("highest-rated/"); // Use the new Axios instance
        setFreelancers(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      }
    };

    fetchFreelancers();
  }, []);

  // Fetch highest-rated Client
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await AxiosClientsInstance.get("highest-rated/"); // Use the new Axios instance
        setClients(response.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching Clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <Container className="text-center text-lg-start">
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
              <Form.Control
                type="text"
                placeholder="Search"
                className=" mr-sm-2 w-100"
              />
            </Col>
            <Col xs="auto" className="d-none d-lg-inline">
              <Button type="submit">Search</Button>
            </Col>
          </Row>
        </Col>
        <Col xs={4} md={2}>
          <img width={"350%"} src={proImage} alt="Freelance Platform" />
        </Col>
      </Row>
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

      <Row>
        <Col xs={10} md={6} className="d-flex align-content-center flex-wrap">
          <div className="divhit g-1">
            {clients.slice(0, 4).map((client, id) => (
              <img
                key={id}
                width={"50%"}
                height={"50%"}
                className="rounded"
                src={client.image}
                alt={`Client ${id + 1}`}
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

      <div className="row mt-5">
        <div className="col-md-4 rounded divhit text-center d-flex align-content-center flex-wrap">
          <h3 className="mx-auto">Featured themes</h3>
          <p>
            Every week, our staff personally hand-pick some of the best new
            website themes from our collection.
          </p>
          <Btn title={"View all featured themes"} />
        </div>

        {/* Top Rated Freelancers */}
        <div className="col-md-8">
          <Row xs={1} md={2} className="g-4">
            {freelancers.slice(0, 4).map((freelancer, idx) => (
              <Col key={idx} className="h-100">
                <Card className="shadow-lg">
                  <Card.Img
                    variant="top"
                    src={freelancer.image || proImages} // Use freelancer's image or a default image
                    alt={freelancer.name}
                  />
                  <Card.Body>
                    <Card.Title>
                      {freelancer.name}
                      <br />
                      <RateStars rating={freelancer.rate} />
                    </Card.Title>
                    <Card.Text>
                      <strong>Description:</strong> {freelancer.description || "No description available."}
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