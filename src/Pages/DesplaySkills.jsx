import { Alert, Badge, Button, Card, Col, Form, Image, InputGroup, Placeholder, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import RateStars from '../Components/RateStars';
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosSkillsInstance } from "../network/API/AxiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-bootstrap-icons";
import DrawRequiredSkills from "../Components/DrawRequiredSkills";

function DesplaySkills(props) {
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

  return (
    <>
    {/* <HeaderColoredText text="Your Profile"/> */}


<Row className="justify-content-center mt-5">
                <Col md={24}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <Card.Title className="text-center">Freelancer Skills</Card.Title>
                            
                                <div>
                                
                                    <DrawRequiredSkills required_skills = "njnjnjnj"/>
                                    
                                </div>
                            
                              {/* <button className="btn btn-primary" onClick={}>Update Skills</button> */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

    </>
    
  );
}

export default DesplaySkills;
