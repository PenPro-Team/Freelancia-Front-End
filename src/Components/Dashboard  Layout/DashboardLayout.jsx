import React from 'react'
import { Col, Container, Nav, Row } from 'react-bootstrap'

export default function DashboardLayout() {
    return (
        <>
            <Container>
                <Row>
                    <Col sm={4}>
                        <Nav defaultActiveKey="/home" className="flex-column">
                            <Nav.Link href="/home">Active</Nav.Link>
                            <Nav.Link eventKey="link-1">Link</Nav.Link>
                            <Nav.Link eventKey="link-2">Link</Nav.Link>
                            <Nav.Link eventKey="disabled" disabled>
                                Disabled
                            </Nav.Link>
                        </Nav>
                    </Col>
                    <Col sm={8}>
                        
                    </Col>
                </Row>
            </Container>
        </>
    )
}
