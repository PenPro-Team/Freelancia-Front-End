import { Alert, Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AxiosSkillsInstance } from "../network/API/AxiosInstance";

function UpdateSkills() {
    const [skillsOptions, setSkillsOptions] = useState([]); // Available skills for dropdown
    const [selectedSkill, setSelectedSkill] = useState(""); // Skill chosen by freelancer
    const [selectedSkills, setSelectedSkills] = useState([]); // Array of selected skills
    const [message, setMessage] = useState("");

    // Fetch skills for the dropdown
    useEffect(() => {
        AxiosSkillsInstance.get("")
            .then((response) => {
                setSkillsOptions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching skills:", error);
            });
    }, []);

    // Add selected skill to the list
    const handleAddSkill = () => {
        if (selectedSkill && !selectedSkills.includes(selectedSkill)) {
            setSelectedSkills((prev) => [...prev, selectedSkill]);
            setSelectedSkill(""); // Reset dropdown
            setMessage("Skill added successfully!");
        }
    };

    // Save selected skills to localStorage
    const handleUpdateSkills = () => {
        localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills)); // Save skills
        console.log("Saved Skills to localStorage:", selectedSkills); // Debugging log
        setMessage("Skills have been updated and saved!");
    };

    return (
        <Row className="justify-content-center mt-5">
            <Col md={24}>
                <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                    <Card.Body>
                        <Card.Title className="text-center">Update Your Skills</Card.Title>

                        {/* Dropdown for selecting skills */}
                        <Form.Group controlId="skill" className="mb-3">
                            <Form.Label>Available Skills</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    as="select"
                                    value={selectedSkill}
                                    onChange={(e) => setSelectedSkill(e.target.value)}
                                >
                                    <option value="">Select a skill</option>
                                    {skillsOptions.map((skill) => (
                                        <option key={skill.id} value={skill.skill}>
                                            {skill.skill}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Button variant="secondary" onClick={handleAddSkill}>
                                    Add
                                </Button>
                            </InputGroup>
                            <Form.Control
                                type="text"
                                readOnly
                                value={selectedSkills.join(", ")}
                                className="mt-2"
                            />
                        </Form.Group>

                        {message && <Alert variant="info">{message}</Alert>}
                        <Button className="btn btn-primary" onClick={handleUpdateSkills}>
                            Update Skills
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default UpdateSkills;
