import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import HeaderColoredText from "../Components/HeaderColoredText";

function ProjectContract() {
    const location = useLocation();
    const proposal = location.state?.proposal;

    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        terms: '',
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
            // Form submission logic goes here
            console.log('Contract submitted:', formData);
            // You would typically make an API call here to save the contract
        }
        
        setValidated(true);
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
