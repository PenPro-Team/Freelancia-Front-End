import { Alert, Badge, Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import RateStars from '../Components/RateStars';
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosFreelancerSkillsInstance } from "../network/API/AxiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-bootstrap-icons";
import DrawSkills from "../Components/DrawSkills";

function DesplaySkills(props) {
    const auth = getFromLocalStorage("auth");
    const user = auth ? auth.user : null;
    const history = useHistory();
    const [freelancerState, setFreelancerState] = useState({}); // Initialize as an empty object

    const params = useParams();
    const user_id = params.user_id;

    useEffect(() => {
        AxiosFreelancerSkillsInstance.get(`?user_id=${user_id}`)
            .then((response) => {
                setFreelancerState(response.data);
                console.log(response);
                console.log(response.data);
                
                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                
            })
            .catch((error) => {
                console.error("Error fetching skills:", error);
                setFreelancerState({});
            });
    }, []); // Add user_id as a dependency

    return (
        <>
            {/* <HeaderColoredText text="Your Profile"/> */}

            <Row className="justify-content-center mt-5">
                <Col md={24}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <Card.Title className="text-center">Freelancer Skills</Card.Title>
                            
                            <div>
                                {freelancerState && freelancerState.map((freelancer) => (
                                    <DrawSkills
                                        key={freelancer.id}
                                        required_skills={freelancer.skill}
                                        bgClass="primary"
                                        notShowingTitle={true}
                                    />
                                ))}
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
