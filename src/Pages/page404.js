import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col className="text-center">
          <h1 className="display-1">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="mb-4">
            Sorry, the page you are looking for does not exist.
          </p>
          <Button variant="primary" onClick={() => history.push("/")}>
            Go Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
