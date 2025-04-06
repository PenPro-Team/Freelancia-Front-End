import { Alert, Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AxiosSkillsInstance } from "../network/API/AxiosInstance";

function UpdateSkills() {
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [message, setMessage] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        // Load saved skills from localStorage when component mounts
        const savedSkills = localStorage.getItem("selectedSkills");
        if (savedSkills) {
            setSelectedSkills(JSON.parse(savedSkills));
        }

        // Fetch available skills from the backend
        AxiosSkillsInstance.get("")
            .then((response) => {
                setSkillsOptions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching skills:", error);
                setMessage("Error loading available skills");
            });
    }, []);

    const handleAddSkill = () => {
        if (selectedSkill && !selectedSkills.includes(selectedSkill)) {
            if (editMode && editIndex !== null) {
                // Update existing skill
                const updatedSkills = [...selectedSkills];
                updatedSkills[editIndex] = selectedSkill;
                setSelectedSkills(updatedSkills);
                setEditMode(false);
                setEditIndex(null);
                setMessage("Skill updated successfully!");
            } else {
                // Add new skill
                setSelectedSkills((prev) => [...prev, selectedSkill]);
                setMessage("Skill added successfully!");
            }
            setSelectedSkill("");
        }
    };

    const handleEditSkill = (index) => {
        setSelectedSkill(selectedSkills[index]);
        setEditMode(true);
        setEditIndex(index);
    };

    const handleDeleteSkill = (index) => {
        const updatedSkills = selectedSkills.filter((_, i) => i !== index);
        setSelectedSkills(updatedSkills);
        setMessage("Skill deleted successfully!");
    };

    const handleUpdateSkills = () => {
        localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
        console.log("Saved Skills to localStorage:", selectedSkills);
        setMessage("Skills have been updated and saved!");
    };

    return (
        <Row className="justify-content-center mt-5">
            <Col md={24}>
                <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                    <Card.Body>
                        <Card.Title className="text-center">Update Your Skills</Card.Title>

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
                                    {editMode ? 'Update' : 'Add'}
                                </Button>
                            </InputGroup>

                            {/* Display selected skills with edit/delete buttons */}
                            <div className="mt-3">
                                {selectedSkills.map((skill, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <Form.Control
                                            type="text"
                                            readOnly
                                            value={skill}
                                            className="me-2"
                                        />
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEditSkill(index)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteSkill(index)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                            </div>
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