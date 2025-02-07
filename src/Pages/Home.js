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

function Home() {
  const user = useSelector((state) => state.auth.user);
  console.log("Logged in User:", user);
  return (
    <Container>
      <Row>
        <Col xs={10} md={6} className="d-flex align-content-center flex-wrap">
          <div>
            <h2>
              Professional WordPress Themes & Website Templates for any project
            </h2>
          </div>
          <p className="fs-5">
            Discover thousands of easy to customize themes, templates & CMS
            products, made by world-class developers.
          </p>

          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search"
                className=" mr-sm-2 w-100"
              />
            </Col>
            <Col xs="auto">
              <Button type="submit">Search</Button>
            </Col>
          </Row>
        </Col>
        <Col xs={4} md={2}>
          <img width={"350%"} src={proImage} />
        </Col>
      </Row>
      <div className="row row-cols-1 row-cols-md-3 g-3 ms-1 mt-2">
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

      <div className="d-flex flex-row justify-content-center align-items-center text-center mt-3 mb-5">
        <Btn title={"View all categories"} />
      </div>

      <Row>
        <Col xs={10} md={6} className="d-flex align-content-center flex-wrap">
          <div className="divhit g-1">
            <img width={"50%"} className="rounded" src={proImages} />
            <img width={"50%"} className="rounded" src={proImages} />
            <img width={"50%"} className="rounded" src={proImages} />
            <img width={"50%"} className="rounded" src={proImages} />
          </div>
        </Col>
        <Col xs={6} md={4} className="d-flex align-content-center flex-wrap">
          <h2>
            Unique themes and templates for every budget and every project.
          </h2>
          <Btn title={"View all themes"} />
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

        {/*top Rated*/}
        <div className="col-md-8">
          <Row xs={1} md={2} className="g-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Col key={idx}>
                <Card>
                  <Card.Img variant="top" src={proImages} />
                  <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                      This is a longer card with supporting text below as a
                      natural lead-in to additional content. This content is a
                      little bit longer.
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
