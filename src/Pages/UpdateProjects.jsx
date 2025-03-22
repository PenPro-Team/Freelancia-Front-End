import { Alert, Button, Card, Col, Container, Form, Image, InputGroup, Placeholder, Row } from "react-bootstrap";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import RateStars from '../Components/RateStars';
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosSkillsInstance } from "../network/API/AxiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-bootstrap-icons";
import Pro1 from "../assets/Projects_Images/img1.png"
import Pro2 from "../assets/Projects_Images/img2.png"
import Pro3 from "../assets/Projects_Images/img3.png"
function UpdateCertificate(props) {
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user : null;
  const navigate = useNavigate();
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
              <Card.Title className="text-center mb-4">Freelancer Project</Card.Title>

              <Container>
                <Row>
                  <Col sm><img src={Pro1} style={{ maxHeight: "30" + "vh" }} className="w-100" alt="" /></Col>
                  <Col sm><img src={Pro2} style={{ maxHeight: "30" + "vh" }} className="w-100" alt="" /></Col>
                  <Col sm><img src={Pro3} style={{ maxHeight: "30" + "vh" }} className="w-100" alt="" /></Col>
                </Row>
              </Container>


              {/* <button className="btn btn-primary" onClick={}>Update Skills</button> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </>

  );
}

export default UpdateCertificate;
