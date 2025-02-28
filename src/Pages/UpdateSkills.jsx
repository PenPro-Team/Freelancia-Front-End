import { Alert, Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import RateStars from '../Components/RateStars';
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosFreelancerSkillsInstance, AxiosSkillsInstance } from "../network/API/AxiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-bootstrap-icons";

function UpdateSkills(props) {
    const auth = getFromLocalStorage("auth");
    const user = auth ? auth.user : null;
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [freelancerState, setFreelancerState] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [message, setMessage] = useState("");
    const [initialData, setInitialData] = useState(null);

    const params = useParams();
    const user_id = params.user_id;

    const [formData, setFormData] = useState({
        skill: [],
    });

    // GET Skills Options in DropDown List
    useEffect(() => {
        AxiosSkillsInstance.get("")
            .then((response) => {
                setSkillsOptions(response.data);
            })
            .catch((error) => {
                console.error("Error fetching skills:", error);
            });
    }, []);

    // Check if there is Data in API or Not
    useEffect(() => {
        AxiosFreelancerSkillsInstance.get(`?user_id=${user_id}`)
            .then((response) => {
                setFreelancerState(response.data);
            })
            .catch((error) => {
                console.error("Error fetching skills:", error);
                setFreelancerState(null);
            });
    }, [user_id]);

    // Drop skill in array
    useEffect(() => {
        if (freelancerState) {
            setFormData({
                skill: freelancerState.skill
                    ? freelancerState.skill.split(", ").filter((skill) => skill)
                    : [],
            });
            setInitialData({
                skill: freelancerState.skill
                    ? freelancerState.skill.split(", ").filter((skill) => skill)
                    : [],
            });
        }
    }, [freelancerState]);

    const handleAddSkill = () => {
        if (selectedSkill && !formData.skill.includes(selectedSkill)) {
            setFormData((prev) => ({
                ...prev,
                skill: [...prev.skill, selectedSkill],
            }));
            setSelectedSkill("");
            setErrors((prev) => ({ ...prev, skill: "" }));
        }
    };

    // Post Skills in API
    const handleSubmit = () => {
        const url = !freelancerState ? `/${freelancerState.id}` : '';
        const method = !freelancerState ? 'patch' : 'post';

        console.log("Submitting form with data:", formData);
        console.log("Freelancer state:", freelancerState);
        console.log(`URL: ${url}, Method: ${method}`);

        AxiosFreelancerSkillsInstance[method](url, {
            user_id: user_id,
            skill: formData.skill.join(", "),
        })
        .then((res) => {
            setMessage("Skills Updated successfully");
            setInitialData({ ...res.data });
        })
        .catch((error) => {
            console.error(`Error ${method}ing skills:`, error);
            setMessage(`Error ${method}ing skills: ` + error.message);
        });
    };

    return (
        <>
            {/* <HeaderColoredText text="Your Profile"/> */}

            <Row className="justify-content-center mt-5">
                <Col md={24}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <Card.Title className="text-center">Freelancer Skills</Card.Title>
                            
                            <div>
                                <Form.Group controlId="skill" className="mb-3">
                                    <Form.Label>Required Skills</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            as="select"
                                            name="selectedSkill"
                                            value={selectedSkill}
                                            onChange={(e) => setSelectedSkill(e.target.value)}
                                            isInvalid={!!errors.skill}
                                        >
                                            <option value="">Select a skill</option>
                                            {
                                                skillsOptions.map((skill) => (
                                                    <option key={skill.id} value={skill.skill}>
                                                        {skill.skill}
                                                    </option>
                                                ))
                                            }
                                        </Form.Control>
                                        <Button variant="secondary" onClick={handleAddSkill}>
                                            Add
                                        </Button>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.skill}
                                    </Form.Control.Feedback>
                                    <Form.Control
                                        type="text"
                                        readOnly
                                        value={formData.skill.join(", ")}
                                        className="mt-2"
                                    />
                                </Form.Group>
                            </div>

                            {message && <Alert variant="info">{message}</Alert>}
                            <button className="btn btn-primary" onClick={handleSubmit}>Update Skills</button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default UpdateSkills;
