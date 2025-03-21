import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Card,
  Row,
  Col,
  Placeholder,
  Form,
  Button,
  Alert,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { AxiosUserInstance } from "../../network/API/AxiosInstance";

export default function EditSecurity() {
  const [userData, setUserData] = useState({});
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user.id : null;
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({});
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [show, setShow] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleOld, setIsVisibleOld] = useState(false);
  const [isVisibleConf, setIsVisibleConf] = useState(false);
  const [newPassword, setNewPassword] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [pwdError, setPwdError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const robustPasswordRegex = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const userNameReg = /^[a-z0-9\._]{3,}$/;
  const [isFormValid, setIsFormValid] = useState(null);

  const handlePassword = (e) => {
    const { name, value } = e.target;
    setNewPassword({ ...newPassword, [name]: value });
    let errorMessage = "";

    if (name === "newPassword" && !robustPasswordRegex.test(value)) {
      errorMessage =
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long, with no spaces.";
    } else if (name === "confirmPassword" && value !== newPassword.newPassword) {
      errorMessage = "Passwords do not match!";
    }

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, [name]: errorMessage };
      setIsFormValid(Object.values(updatedErrors).every((err) => err === ""));
      return updatedErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    let errorMessage = "";

    if (value.trim() === "") {
      errorMessage = "This field is required";
    } else if (name === "username" && !userNameReg.test(value)) {
      errorMessage =
        "Username must be at least 3 characters and follow the correct format.";
    } else if (name === "email" && !emailRegex.test(value)) {
      errorMessage = "Invalid email format";
    }

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, [name]: errorMessage };
      setIsFormValid(Object.values(updatedErrors).every((err) => err === ""));
      return updatedErrors;
    });
  };

  const checkAvailability = async (field, value) => {
    if (
      (field === "username" && value !== userData.username) ||
      (field === "email" && userData.email !== value)
    ) {
      try {
        const response = await AxiosUserInstance.get(`?${field}=${value}`);
        const isExists = response.data.length > 0;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: isExists ? `${field} already exists` : "",
        }));
        setIsFormValid(!isExists);
      } catch (error) {
        console.error(`Error checking ${field} availability:`, error);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "username" || name === "email") {
      checkAvailability(name, value);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    AxiosUserInstance.get(`${params.user_id}`)
      .then((res) => {
        setUserData(res.data);
        setFormValues(res.data);
        setIsEmpty(!Object.keys(res.data).length);
        if (!Object.keys(res.data).length) {
          navigate("/Freelancia-Front-End/404");
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/Freelancia-Front-End/404");
      })
      .finally(() => setIsLoading(false));
  }, [navigate, params.user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSuccess(false);
    setShowError(false);

    const updatedFormValues = {
      ...formValues,
      password: newPassword.newPassword || userData.password,
    };

    if (userData.password === newPassword.password) {
      if (isFormValid) {
        try {
          const response = await AxiosUserInstance.patch(
            `${params.user_id}`,
            updatedFormValues
          );
          setShowSuccess(true);
          setUserData(response.data);
          setShowModal(false);
        } catch (error) {
          setShowError(true);
          console.error("Error updating security details:", error);
        }
      }
    } else {
      setPwdError("Incorrect Password! Please Try Again.");
    }
  };

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setPwdError("");
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);

  const isSubmitDisabled = () =>
    !isFormValid ||
    (userData.username === formValues.username &&
      userData.email === formValues.email &&
      (!newPassword.newPassword || newPassword.newPassword !== newPassword.confirmPassword));

  return (
    <Row className="justify-content-center mt-5">
      <Col md={24}>
        <Card className="shadow-lg p-3 mb-5 bg-white rounded">
          <Card.Body>
            <Card.Title className="text-center">User Information</Card.Title>
            {isLoading ? (
              <div>
                <Placeholder xs={6} />
                <Placeholder className="w-75" />
                <Placeholder style={{ width: "25%" }} />
              </div>
            ) : (
              <>
                {showSuccess && (
                  <Alert variant="success" dismissible>
                    Your data was updated successfully!
                  </Alert>
                )}
                {showError && (
                  <Alert variant="danger" dismissible>
                    Error updating your data! Please try again.
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      name="username"
                      value={formValues.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      value={formValues.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row className="mb-3 border border-2 rounded-3 p-3">
                    <h3>Update Password</h3>
                    <Form.Group className="w-100">
                      <Form.Label>New Password</Form.Label>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="newPassword"
                          type={isVisible ? "text" : "password"}
                          onChange={handlePassword}
                          isInvalid={!!errors.newPassword}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setIsVisible(!isVisible)}
                        >
                          {isVisible ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.newPassword}
                        </Form.Control.Feedback>
                      </InputGroup>
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup className="mb-3">
                        <Form.Control
                          name="confirmPassword"
                          type={isVisibleConf ? "text" : "password"}
                          onChange={handlePassword}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setIsVisibleConf(!isVisibleConf)}
                        >
                          {isVisibleConf ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Row>
                  <Button
                    variant="primary"
                    onClick={handleShow}
                    disabled={isSubmitDisabled()}
                  >
                    Submit
                  </Button>
                  <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Your Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Group controlId="formCurrentPassword">
                        <Form.Label>Current Password</Form.Label>
                        {pwdError && (
                          <Alert variant="danger" dismissible={false}>
                            {pwdError}
                          </Alert>
                        )}
                        <InputGroup>
                          <Form.Control
                            name="password"
                            type={isVisibleOld ? "text" : "password"}
                            onChange={handlePassword}
                            isInvalid={!!errors.password}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setIsVisibleOld(!isVisibleOld)}
                          >
                            {isVisibleOld ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Form>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
