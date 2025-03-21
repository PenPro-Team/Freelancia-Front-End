import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getFromLocalStorage, setToLocalStorage } from '../../network/local/LocalStorage';
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col, Placeholder, Form, Button, Alert } from "react-bootstrap";
import personalImg from "../../assets/hero-bg.jpg";
import defaultImage from "../../assets/default-user.png";
import { AxiosUserInstance } from '../../network/API/AxiosInstance';

export default function EditClientInfo(props) {
    const [userData, setUserData] = useState({});
    const auth = getFromLocalStorage("auth");
    const user = auth ? auth.user : null;
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
        first_name: "",
        last_name: "",
        birth_date: "",
        postal_code: "",
        address: "",
        description: "",
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    const userRegex = /^[a-zA-Z]+$/;

    useEffect(() => {
        setIsLoading(true);
        AxiosUserInstance.get(`${params.user_id}`)
            .then((res) => {
                setUserData(res.data);
                setFormValues(res.data);

                if (Object.keys(res.data).length) {
                    setIsEmpty(false);
                } else {
                    setIsEmpty(true);
                    navigate("/Freelancia-Front-End/404");
                }
            })
            .catch((err) => {
                console.error(err);
                navigate("/Freelancia-Front-End/404");
                setIsEmpty(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate, params.user_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = "";

        if (value.trim() === "") {
            errorMessage = "This field is required";
        } else {
            switch (name) {
                case "first_name":
                case "last_name":
                    if (!userRegex.test(value)) {
                        errorMessage = "Only letters are allowed";
                    }
                    break;
                case "birth_date":
                    const selectedDate = new Date(value);
                    const currentDate = new Date();
                    const age = currentDate.getFullYear() - selectedDate.getFullYear();

                    if (age < 18) {
                        errorMessage = "You must be at least 18 years old";
                    }
                    break;
                case "postal_code":
                    if (!/^\d+$/.test(value)) {
                        errorMessage = "Postal code must contain only numbers";
                    }
                    break;
                case "address":
                    if (value.trim().length < 5) {
                        errorMessage = "Address must be at least 5 characters long";
                    }
                    break;
                case "description":
                    if (value.length < 200) {
                        errorMessage = "Description must be at least 200 characters long";
                    }
                    break;
                default:
                    break;
            }
        }

        setFormValues({ ...formValues, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
        setIsFormValid(Object.values(errors).every((err) => err === ""));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuccess(false);
        setShowError(false);

        if (isFormValid) {
            AxiosUserInstance.patch(`${params.user_id}`, formValues, {
                headers: { Authorization: `Bearer ${user.access}` }
            })
                .then((res) => {
                    setShowSuccess(true);
                    setUserData(formValues);
                    props.cb();
                })
                .catch((error) => {
                    console.error(error);
                    setShowError(true);
                });
        }
    };

    const handleDeleteImage = (e) => {
        e.preventDefault();
        AxiosUserInstance.patch(`${params.user_id}`, { image: null }, {
            headers: { Authorization: `Bearer ${user.access}` }
        })
            .then((res) => {
                setUserData({ ...userData, image: null });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleUploadImage = (e) => {
        e.preventDefault();

        const upload_file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', upload_file);

        AxiosUserInstance.patch(`${params.user_id}`, formData, {
            headers: {
                Authorization: `Bearer ${user.access}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                setUserData({ ...userData, image: res.data.image });
                setToLocalStorage("auth", { ...auth, user: { ...auth.user, image: res.data.image } });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const isUnchanged = () =>
        userData.first_name === formValues.first_name &&
        userData.last_name === formValues.last_name &&
        userData.address === formValues.address &&
        userData.postal_code === formValues.postal_code &&
        userData.birth_date === formValues.birth_date &&
        userData.description === formValues.description &&
        !formValues.image;

    return (
        <>
            <Row className="justify-content-center mt-5">
                <Col md={24}>
                    <Card className="shadow-lg p-3 mb-5 bg-white rounded">
                        <Card.Body>
                            <Card.Title className="text-center">Edit User Information</Card.Title>
                            {isLoading ? (
                                <div>
                                    <Card className="shadow-lg p-3 mb-5 bg-white rounded"></Card>
                                    <Placeholder xs={6} />
                                    <Placeholder className="w-75" />
                                    <Placeholder style={{ width: "25%" }} />
                                </div>
                            ) : (
                                <Form onSubmit={handleSubmit} encType='multipart/form-data'>
                                    {showSuccess && (
                                        <Alert variant='success' dismissible>
                                            Your data was updated successfully!
                                        </Alert>
                                    )}
                                    {showError && (
                                        <Alert variant='danger' dismissible>
                                            Error updating your data! Please try again.
                                        </Alert>
                                    )}
                                    <Form.Group controlId="formFile" className="mb-3">
                                        {userData.image ? (
                                            <div className='d-flex flex-wrap justify-content-center'>
                                                <img
                                                    className="rounded-circle mb-2 mx-3"
                                                    width={"128px"}
                                                    height={"128px"}
                                                    src={userData.image || defaultImage}
                                                    alt="user"
                                                />
                                                <Button variant="outline-danger mx-2" onClick={handleDeleteImage}>
                                                    Delete Image
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className='d-flex flex-wrap justify-content-center'>
                                                <img
                                                    className="rounded-circle mb-2 mx-3"
                                                    width={"128px"}
                                                    height={"128px"}
                                                    src={defaultImage}
                                                    alt="default"
                                                />
                                            </div>
                                        )}
                                        <Form.Label>Upload Image</Form.Label>
                                        <input type="file" name="image" onChange={handleUploadImage} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formGridAddress1">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            name='first_name'
                                            type="text"
                                            value={formValues.first_name}
                                            onChange={handleChange}
                                            isInvalid={!!errors.first_name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.first_name}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formGridAddress2">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            name='last_name'
                                            type="text"
                                            value={formValues.last_name}
                                            onChange={handleChange}
                                            isInvalid={!!errors.last_name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.last_name}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Repeat similar Form.Group for other fields */}

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={!isFormValid || isUnchanged()}
                                    >
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
