import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosContractsInstance,AxiosProjectsInstance } from "../network/API/AxiosInstance";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { useNavigate } from "react-router-dom"; 

function ProjectContract() {
    const location = useLocation();
    const navigate=useNavigate();
    const proposal = location.state?.proposal;
    console.log(proposal);
    const [validated, setValidated] = useState(false);
    const currentUser = getFromLocalStorage("auth");
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        terms: proposal?.propose_text || '',
        deadline: proposal?.deadline || '',
        budget: proposal?.price || '',
        freelancer: proposal?.user?.name || ''
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            createContract()
     
            // console.log('Contract submitted:', formData);
            // You would typically make an API call here to save the contract
        }
        
        setValidated(true);
    };
    const createContract=()=>{
        AxiosContractsInstance.post("create",{
            contract_terms:formData.terms,
            deadline:formData.deadline,
            budget:formData.budget,
            freelancer:proposal.user.id,
            client:currentUser.user.user_id,
            project:proposal.project.id,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.user.access}`, 
            },
          }
        ).then((response)=>{
            console.log("Contract created successfully");
            console.log(response);
            navigate(`/Freelancia-Front-End/clientContracts/${currentUser.user.user_id}`);

          }).catch((error)=>{
            setError(error.response.data.message);
            console.log(error);
          });
    };


    // Update form data
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({...formData, [id]: value});
    };

    if (!proposal) {
        return (
            <Container className="my-5 text-center">
                <h4 className="text-danger">Error: No proposal data available</h4>
                <p>Please return to the proposals page and select a valid proposal.</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            {error && <Alert variant="danger">{error}</Alert>}
          
            <HeaderColoredText text="Create Contract" />
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                    <Form.Label>Terms<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        as="textarea"
                        id="terms"
                        rows="4"
                        placeholder="Enter contract terms and conditions"
                        value={formData.terms}
                        onChange={handleChange}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide contract terms.
                    </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                    <Form.Label>Deadline (days)<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="number"
                        id="deadline"
                        min="1"
                        placeholder="Enter number of days"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please specify a valid deadline.
                    </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                    <Form.Label>Budget<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="number"
                        id="budget"
                        placeholder="Enter budget amount"
                        min="0"
                        step="0.01"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid budget amount.
                    </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                    <Form.Label>Freelancer</Form.Label>
                    <Form.Control
                        type="text"
                        id="freelancer"
                        value={formData.freelancer}
                        readOnly
                    />
                </Form.Group>
                
                <div className="d-grid gap-2 mt-4">
                    <Button variant="primary" type="submit" size="lg">
                        Create Contract
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default ProjectContract;
