import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getFromLocalStorage } from '../../network/local/LocalStorage';
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Row, Col, Placeholder, Form, Button, Alert } from "react-bootstrap";
import personalImg from "../../assets/hero-bg.jpg";


export default function EditClientInfo() {
    const [userData, setUserData] = useState({})
    const auth = getFromLocalStorage("auth");
    const user = auth ? auth.user.id : null;
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const params = useParams();
    const history = useHistory();
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(true);
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        birthdate: "",
        postalCode: "",
        address: "",
        description: ""
    });
    console.log(formValues.firstName);
    const [isFormValid, setIsFormValid] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // تعديل regex للباسوورد بحيث يتطلب حروف وأرقام إنجليزي، على الأقل 8 أحرف، حرف واحد كابتل، حرف واحد سمول ورقم واحد
    const robustPasswordRegex = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const userNameReg = /^[a-z0-9\._]{3,}$/;

    // console.log(params);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        setFormValues({ ...formValues, [name]: newValue });
        let errorMessage = "";
        console.log(name);

        // console.log(e.target.name);

        if (newValue.trim() === "") {
            errorMessage = "This field is required";
        } else {
            switch (name) {
                case "firstName":
                case "lastName":
                    if (!/^[a-zA-Z]+$/.test(newValue)) {
                        errorMessage = "Only letters are allowed";
                    }
                    break;
                case "birthdate":
                    // التحقق من أن المستخدم أكبر من 18 سنة
                    const selectedDate = new Date(newValue);
                    const currentDate = new Date();
                    const ageDifMs = currentDate - selectedDate;
                    const ageDate = new Date(ageDifMs);
                    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                    if (age < 18) {
                        errorMessage = "You must be at least 18 years old";
                    }
                    break;
                case "postalCode":
                    if (!/^\d+$/.test(newValue)) {
                        errorMessage = "Postal code must contain only numbers";
                    }
                    break;
                case "address":
                    if (newValue.trim().length < 5) {
                        errorMessage = "Address must be at least 5 characters long";
                    }
                    break;
                case "description":
                    if (newValue.length < 200) {
                        errorMessage = "Must be at least 200 characters";
                    }
                    break;
                default:
                    break;
            }
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors, [name]: errorMessage };
            const allValid = Object.values(updatedErrors).every((error) => error === "")
            setIsFormValid(allValid);
            return updatedErrors;
        });


    };
    useEffect(() => {
        setIsLoading(true);
        axios.get(`https://api-generator.retool.com/D8TEH0/data/${params.user_id}`)
            .then((res) => {
                setUserData(res.data);
                setFormValues(res.data)
                console.log(res.data);
                // console.log(params.user_id);

                if (Object.keys(res.data).length) {
                    setIsEmpty(false);
                } else {
                    setIsEmpty(true);
                    history.push("/Freelancia-Front-End/404");
                }
            })
            .catch((err) => {
                console.log(err);
                history.push("/Freelancia-Front-End/404");
                setIsEmpty(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [history, params.user_id]);
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuccess(false);
        setShowError(false);
        setShow(true);
        if (isFormValid) {
            axios.put(`https://api-generator.retool.com/D8TEH0/data/${params.user_id}`, formValues)
                .then((res) => {
                    console.log(res.data)
                    setShowSuccess(true)
                    setShowError(false)
                    setUserData(formValues);
                    setShow(true)

                }).catch((error) => {
                    console.log(error);
                    setShowSuccess(false)
                    setShowError(true)
                })
        }
    }

    return (
        <>
            <Row className="justify-content-center mt-5">
                <Col md={24}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <Card.Title className="text-center">User Information</Card.Title>
                            {isLoading ?
                                <div>
                                    <Card className="shadow-lg p-3 mb-5 bg-white rounded"></Card>
                                    <Placeholder xs={6} />
                                    <Placeholder className="w-75" />
                                    <Placeholder style={{ width: "25%" }} />
                                </div>
                                :
                                <>
                                    <Form onSubmit={handleSubmit}></Form>
                                    {showSuccess ?

                                        <Alert variant='success' onClose={() => setShow(false)} dismissible>
                                            Your Data was Updated Successfully!
                                        </Alert>
                                        :
                                        ""
                                    }
                                    {showError ?
                                        <Alert variant='danger' dismissible onClose={() => setShow(false)}>
                                            Error Updating your data!, please try again..
                                        </Alert>
                                        :
                                        ""
                                    }
                                    <Form onSubmit={handleSubmit}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="formGridEmail">
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control
                                                    name='firstName'
                                                    type="text"
                                                    placeholder="First Name"
                                                    value={formValues.firstName}
                                                    onChange={handleChange}
                                                    isInvalid={Boolean(errors.firstName)}
                                                    feedback={errors.firstName}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="formGridPassword">
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control
                                                    name='lastName'
                                                    type="text"
                                                    placeholder="Last Name"
                                                    value={formValues.lastName}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Row>

                                        <Form.Group className="mb-3" controlId="formGridAddress1">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                name='address'
                                                placeholder="1234 Main St"
                                                value={formValues.address}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formGridAddress2">
                                            <Form.Label>Postal Code</Form.Label>
                                            <Form.Control
                                                name='postalCode'
                                                placeholder="62511 i.e"
                                                value={formValues.postalCode}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="formGridCity">
                                                <Form.Label>Birth Date</Form.Label>
                                                <Form.Control
                                                    name='birthdate'
                                                    type="date"
                                                    value={formValues.birthdate}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Row>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control as="textarea"
                                                rows={3}
                                                name='description'
                                                value={formValues.description}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" disabled={!isFormValid || (userData.firstName == formValues.firstName && userData.lastName == formValues.lastName && userData.address == formValues.address && userData.postalCode == formValues.postalCode && userData.birthdate == formValues.birthdate && userData.description == formValues.description)} >
                                            Submit
                                        </Button>
                                    </Form>
                                <Link to={`/Freelancia-Front-End/Dashboard/security/${userData.id}`}>Edit Information</Link>
                                </>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
