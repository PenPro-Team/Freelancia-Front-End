import { Alert, Badge, Card, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

function DesplaySkills() {
    const [skills, setSkills] = useState([]); // Array of selected skills

    // Retrieve selected skills from localStorage
    useEffect(() => {
        const storedSkills = localStorage.getItem("selectedSkills");
        if (storedSkills) {
            const parsedSkills = JSON.parse(storedSkills);
            console.log("Retrieved Skills from localStorage:", parsedSkills); // Debugging log
            setSkills(parsedSkills); // Parse and set the skills
        } else {
            console.log("No skills found in localStorage."); // Debugging log
        }
    }, []);

    return (
        <Row className="justify-content-center mt-5">
            <Col md={24}>
                <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                    <Card.Body>
                        <Card.Title className="text-center">Freelancer Skills</Card.Title>

                        {skills && skills.length > 0 ? (
                            skills.map((skill, index) => (
                                <Badge key={index} bg="primary" className="m-1">
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <Alert variant="info">No skills have been added yet.</Alert>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default DesplaySkills;
