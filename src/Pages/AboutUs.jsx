import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaHandshake, FaShieldAlt, FaRocket } from 'react-icons/fa';

const AboutUs = () => {
    return (
        <Container className="py-5">
            <Row className="justify-content-center mb-5">
                <Col md={8} className="text-center">
                    <h1 className="mb-4">About Freelancia</h1>
                    <p className="lead text-muted">
                        Freelancia is a leading freelance marketplace connecting talented professionals 
                        with clients worldwide. Our platform enables seamless collaboration and 
                        empowers both freelancers and businesses to achieve their goals.
                    </p>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={3}>
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <FaUsers className="text-primary mb-3" size={40} />
                            <h3>10K+</h3>
                            <p>Active Users</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <FaHandshake className="text-primary mb-3" size={40} />
                            <h3>5K+</h3>
                            <p>Completed Projects</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <FaShieldAlt className="text-primary mb-3" size={40} />
                            <h3>100%</h3>
                            <p>Secure Payments</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <FaRocket className="text-primary mb-3" size={40} />
                            <h3>24/7</h3>
                            <p>Support</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={6}>
                    <h3 className="mb-4">Our Mission</h3>
                    <p>
                        To create opportunities for anyone in the world to build their business, 
                        brand, or dream. We provide a platform where talent meets opportunity, 
                        enabling professionals to work on their terms and clients to find the 
                        perfect match for their projects.
                    </p>
                </Col>
                <Col md={6}>
                    <h3 className="mb-4">Our Vision</h3>
                    <p>
                        To be the world's leading platform where freelancers and clients connect, 
                        collaborate, and create success stories together. We aim to revolutionize 
                        the way work gets done by providing innovative solutions and fostering a 
                        global community of professionals.
                    </p>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card className="bg-light">
                        <Card.Body>
                            <h3 className="mb-4">Why Choose Freelancia?</h3>
                            <Row>
                                <Col md={4}>
                                    <h5>Quality Work</h5>
                                    <p>Access top talent and quality services from professionals worldwide.</p>
                                </Col>
                                <Col md={4}>
                                    <h5>Secure Payments</h5>
                                    <p>Your payments are secure and released only when you're satisfied.</p>
                                </Col>
                                <Col md={4}>
                                    <h5>24/7 Support</h5>
                                    <p>Our dedicated team is here to help you succeed around the clock.</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUs;
