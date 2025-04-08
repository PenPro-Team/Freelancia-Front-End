import { Alert, Badge, Card, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function DesplaySkills() {
    const { t } = useTranslation();
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
                        <Card.Title className="text-center">{t('dashboard.skills.title')}</Card.Title>

                        {skills && skills.length > 0 ? (
                            skills.map((skill, index) => (
                                <Badge key={index} bg="primary" className="m-1">
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <Alert variant="info">{t('dashboard.skills.noSkills')}</Alert>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default DesplaySkills;
