import { Alert, Button, Card, Col, Form, Image, InputGroup, Placeholder, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import RateStars from '../Components/RateStars';
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosSkillsInstance } from "../network/API/AxiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-bootstrap-icons";

function UpdateSkills(props) {
    const auth = getFromLocalStorage("auth");
    const user = auth ? auth.user : null;
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState("");
    const [initialData, setInitialData] = useState(null);
    const userSkill = '';
    const [formData, setFormData] = useState({
        requiredSkills: [],
      });

    useEffect(() => {
        AxiosSkillsInstance.get("")
          .then((response) => {
            setSkillsOptions(response.data);
          })
          .catch((error) => {
            console.error("Error fetching skills:", error);
          });
      }, [])


       useEffect(() => {
          
            setFormData({
              requiredSkills: userSkill.required_skills
                ? userSkill.required_skills.split(", ").filter((skill) => skill)
                : [],
            });
            setInitialData({
              requiredSkills: userSkill.required_skills
                ? userSkill.required_skills.split(", ").filter((skill) => skill)
                : [],
            });
          
        }, []);


      const handleAddSkill = () => {
        if (selectedSkill && !formData.requiredSkills.includes(selectedSkill)) {
          setFormData((prev) => ({
            ...prev,
            requiredSkills: [...prev.requiredSkills, selectedSkill],
          }));
          setSelectedSkill("");
          setErrors((prev) => ({ ...prev, requiredSkills: "" }));
        }
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
                                  <Form.Group controlId="requiredSkills" className="mb-3">
                                      <Form.Label>Required Skills</Form.Label>
                                      <InputGroup>
                                        <Form.Control
                                          as="select"
                                          name="selectedSkill"
                                          value={selectedSkill}
                                          onChange={(e) => setSelectedSkill(e.target.value)}
                                          isInvalid={!!errors.requiredSkills}
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
                                      <Form.Control.Feedback type="invalid">
                                        {errors.requiredSkills}
                                      </Form.Control.Feedback>
                                      <Form.Control
                                        type="text"
                                        readOnly
                                        value={formData.requiredSkills.join(", ")}
                                        className="mt-2"
                                      />
                                    </Form.Group>
                                    
                              </div>
                            
                              {/* <button className="btn btn-primary" onClick={}>Update Skills</button> */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

    </>
    
  );
}

export default UpdateSkills;
