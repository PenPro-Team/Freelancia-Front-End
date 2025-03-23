import { Alert, Button, Card, Col, Container, Form, Image, InputGroup, Placeholder, Row } from "react-bootstrap";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { AxiosSkillsInstance } from "../network/API/AxiosInstance";
import { useEffect, useState } from "react";
import cert1 from "../assets/certificate (1).png"
import cert2 from "../assets/certificate (2).png"
import cert3 from "../assets/IMG_20250226_141719.jpg"
function DisplayCertificate(props) {
    const auth = getFromLocalStorage("auth");
    const user = auth ? auth.user : null;
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
                            <Card.Title className="text-center">Freelancer Certificate</Card.Title>

                            <Container>
                                <Row>
                                    <Col sm><img src={cert1} className="w-100" alt="" /></Col>
                                    <Col sm><img src={cert3} className="w-100 h-75" alt="" /></Col>
                                    <Col sm><img src={cert2} className="w-100" alt="" /></Col>
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

export default DisplayCertificate;
