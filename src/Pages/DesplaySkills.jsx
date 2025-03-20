import { Alert, Badge, Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import RateStars from '../Components/RateStars';
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosFreelancerSkillsInstance, AxiosUserInstance } from "../network/API/AxiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-bootstrap-icons";
import DrawSkills from "../Components/DrawSkills";

function DesplaySkills(props) {
    const auth = getFromLocalStorage("auth");
    const user = auth ? auth.user : null;
    const history = useHistory();
    const [freelancerState, setFreelancerState] = useState([]); // Initialize as an empty array
    const [specificFreelancer, setSpecificFreelancer] = useState(null); // State for the specific freelancer

    const params = useParams();
    const user_id = params.user_id;

    useEffect(() => {
        AxiosUserInstance.get(`?user_id=${user_id}`)
            .then((response) => {
                setFreelancerState(response.data);
                console.log(response.data); // Log the response data for debugging

                // Find the freelancer with the matching user_id
                const freelancer = response.data.find(f => f.id === parseInt(user_id));
                setSpecificFreelancer(freelancer); // Set the specific freelancer
            })
            .catch((error) => {
                console.error("Error fetching skills:", error);
                setFreelancerState([]);
                setSpecificFreelancer(null); // Reset specific freelancer on error
            });
    }, [user_id]);

    return (
        <>
            <Row className="justify-content-center mt-5">
                <Col md={24}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <Card.Title className="text-center">Freelancer Skills</Card.Title>

                            <div>
                                {specificFreelancer ? (
                                    <div key={specificFreelancer.id}>
                                        <h4>{specificFreelancer.username}</h4>
                                        {specificFreelancer.skills && specificFreelancer.skills.length > 0 ? (
                                            <DrawSkills
                                                required_skills={specificFreelancer.skills.map(skillObj => skillObj.skill)} // Extract the `skill` property
                                                bgClass="primary"
                                                notShowingTitle={true}
                                            />
                                        ) : (
                                            <Alert variant="info">No skills found for this freelancer.</Alert>
                                        )}
                                    </div>
                                ) : (
                                    <Alert variant="warning">No freelancer data found for this ID.</Alert>
                                )}
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