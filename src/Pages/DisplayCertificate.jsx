import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AxiosFreelancersCertificate } from "../network/API/AxiosInstance";
import { useParams } from "react-router-dom";
import { getFromLocalStorage } from "../network/local/LocalStorage";

function DisplayCertificate() {
  const { user_id } = useParams(); // Extract user ID from the route params
  const [certificates, setCertificates] = useState([]); // Store fetched certificates
  const [error, setError] = useState(""); // Handle errors

  // Fetch certificates for the freelancer
  useEffect(() => {
    // Fetch certificates for the freelancer without authentication
    AxiosFreelancersCertificate.get(`?user=${user_id}`)
      .then((response) => {
        setCertificates(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching certificates:", error);
        setError("Failed to fetch certificates. Please try again.");
      });
  }, [user_id]);

  return (
    <>
      <Row className="justify-content-center mt-5">
        <Col md={24}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title className="text-center">
                Freelancer Certificates
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}
              {!error && certificates.length === 0 && (
                <Alert variant="info">No certificates available.</Alert>
              )}

              {/* Display certificates */}
              <Container>
                <Row>
                  {certificates.map((certificate, index) => (
                    <Col sm={12} md={6} lg={4} key={index} className="mb-4">
                      <Card className="shadow-sm h-100">
                        <Card.Img
                          variant="top"
                          src={certificate.image} // Image URL from API
                          alt={`Certificate ${index + 1}`}
                          className="w-100"
                        />
                        <Card.Body>
                          <Card.Title>{certificate.title}</Card.Title>
                          <Card.Text>
                            <strong>Issued By:</strong> {certificate.issued_by}{" "}
                            <br />
                            <strong>Issued Date:</strong>{" "}
                            {certificate.issued_date} <br />
                            <strong>Description:</strong>{" "}
                            {certificate.description}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default DisplayCertificate;
