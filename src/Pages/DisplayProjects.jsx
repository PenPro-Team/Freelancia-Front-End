import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AxiosFreelancersGetPortfolios } from "../network/API/AxiosInstance";
import { useParams } from "react-router-dom";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { useTranslation } from "react-i18next";

function DisplayProjects() {
  const { user_id } = useParams();
  const [projects, setProjects] = useState([]); // Store fetched projects
  const [error, setError] = useState(""); // Handle errors
  const BASE_URL = "http://127.0.0.1:8000/";
  const { t } = useTranslation();
  // Fetch projects for the freelancer
  useEffect(() => {
    // Fetch projects for the freelancer
    console.log("meow", user_id);
    AxiosFreelancersGetPortfolios.get(`?user_id=${user_id}`)
      .then((response) => {
        setProjects(response.data); // Set the fetched projects
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError("Failed to fetch projects. Please try again.");
      });
  }, [user_id]);
  console.log(projects);

  return (
    <>
      <Row className="justify-content-center mt-5">
        <Col md={24}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title className="text-center">
                {t("dashboard.projects.title")}
              </Card.Title>

              {error && (
                <Alert variant="danger">
                  {t("dashboard.projects.loadError")}
                </Alert>
              )}
              {!error && projects.length === 0 && (
                <Alert variant="info">
                  {t("dashboard.projects.noProjects")}
                </Alert>
              )}

              {/* Display projects */}
              <Container>
                <Row>
                  {projects.map((project, index) => (
                    <Col sm={12} md={6} lg={4} key={index} className="mb-4">
                      <Card className="shadow-sm h-100">
                        <Card.Img
                          variant="top"
                          src={project.main_image} // Main image URL from API
                          alt={`Project ${index + 1}`}
                          className="w-100"
                        />
                        <Card.Body>
                          <Card.Title>{project.title}</Card.Title>
                          <Card.Text>
                            <strong>
                              {t("dashboard.projects.description")}:
                            </strong>{" "}
                            {project.description} <br />
                            {project.images && project.images.length > 0 && (
                              <>
                                <strong>
                                  {t("dashboard.projects.additionalImages")}:
                                </strong>
                                <ul>
                                  {project.images.map((image, imgIndex) => (
                                    <li key={imgIndex}>
                                      <a
                                        href={`${image.image}`} // Prepend BASE_URL for relative paths
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {t("dashboard.projects.viewImage")}{" "}
                                        {imgIndex + 1}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
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

export default DisplayProjects;
