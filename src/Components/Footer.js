import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom"; // Fixed Import Path
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const [freelancers, setFreelancers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const auth = getFromLocalStorage("auth")
  const user = auth ? auth.user : null;
  const userRole = user ? user.role : null;
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter freelancers by username
    const results = freelancers.filter((freelancer) =>
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <footer className="container-fluid blackBack mt-5 py-5">
      <Container className="text-light">
        <Row className="gy-4">
          <Col xs={12} lg={6} className="text-center text-lg-start">
            <h2>{t('footer.headline')}</h2>
            <p>
              {t('footer.description.part1')}<br/>
              {t('footer.description.part2')}<br/>
              {t('footer.description.part3')}
            </p>
            {userRole === "client" ? 
              <Link to={`/Freelancia-Front-End/postjob`}>
                <Button className="btn btn-primary">{t('footer.buttons.shareProject')}</Button>
              </Link>
              : userRole === "freelancer" ? 
              <Link to={`/Freelancia-Front-End/Dashboard/${user.user_id}`}>
                <Button className="btn btn-primary">{t('footer.buttons.viewPortfolio')}</Button>
              </Link>
              : <Link to={`/Freelancia-Front-End/login`}>
                <Button className="btn btn-primary">{t('footer.buttons.loginCta')}</Button>
              </Link>
            }
          </Col>

          <Col xs={6} lg={3} className="text-center text-lg-start">
            <h5>{t('footer.resources.title')}</h5>
            <Link className="text-decoration-none text-primary d-block" to="/Freelancia-Front-End/Job_list">
              {t('footer.resources.projects')}
            </Link>
            <Link className="text-decoration-none text-primary d-block" to="/home">
              {t('footer.resources.home')}
            </Link>
            <Link className="text-decoration-none text-primary d-block" to="/portfolio">
              {t('footer.resources.portfolio')}
            </Link>
            <Link className="text-decoration-none text-primary d-block" to="/Freelancia-Front-End/about">
              {t('footer.resources.aboutUs')}
            </Link>
            <Link className="text-decoration-none text-primary d-block" to="/Freelancia-Front-End/contact">
              {t('footer.resources.contactUs')}
            </Link>
          </Col>

          <Col xs={12} lg={3}>
            <div className="d-flex flex-column">
              <Form onSubmit={handleSearch} className="d-flex mb-3">
                <Form.Control
                  type="text"
                  placeholder={t('footer.search.placeholder')}
                  className="me-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="btn-primary">
                  {t('footer.search.button')}
                </Button>
              </Form>

              <div className="mt-4 text-center text-lg-start">
                {t('footer.copyright')}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
