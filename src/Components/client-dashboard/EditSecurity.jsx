import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getFromLocalStorage } from "../../network/local/LocalStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Card,
  Container,
  Row,
  Col,
  Placeholder,
  Form,
  Button,
  Alert,
  InputGroup,
  Modal,
} from "react-bootstrap";
export default function EditSecurity() {
  const [userData, setUserData] = useState({});
  const auth = getFromLocalStorage("auth");
  const user = auth ? auth.user.id : null;
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const params = useParams();
  const history = useHistory();
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
  // تعديل regex للباسوورد بحيث يتطلب حروف وأرقام إنجليزي، على الأقل 8 أحرف، حرف واحد كابتل، حرف واحد سمول ورقم واحد
  const robustPasswordRegex = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const userNameReg = /^[a-z0-9\._]{3,}$/;
  console.log(formValues.firstName);
  const [isFormValid, setIsFormValid] = useState(null);

  const handlePassword = (e) => {
    const { name, value } = e.target;
    setNewPassword({ ...newPassword, [name]: value });
    let errorMessage = "";
    console.log(newPassword);

    switch (name) {
      case "newPassword":
        if (!robustPasswordRegex.test(value)) {
          console.log(value);
          setIsFormValid(false);
          setFormValues({ ...formValues, password: value });
          errorMessage =
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long ,and no white spaces";
        }
        break;
      case "confirmPassword":
        if (name === "confirmPassword" && value !== newPassword.newPassword) {
          console.log(value);
          errorMessage = "Passwords Do not Match!";
          setIsFormValid(false);
        }
        break;

      default:
        break;
    }
    console.log(isFormValid);

    // setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    // setIsFormValid(true)
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, [name]: errorMessage };
      const allValid = Object.values(updatedErrors).every(
        (error) => error === ""
      );
      setIsFormValid(allValid);
      return updatedErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    setFormValues({ ...formValues, [name]: newValue });
    let errorMessage = "";
    // console.log(name);
    // console.log(e.target.name);

    if (newValue.trim() === "") {
      errorMessage = "This field is required";
    } else {
      switch (name) {
        case "username":
          if (!userNameReg.test(newValue)) {
            errorMessage =
              "Invalid username must be in the right form and more than 3 char ";
          }
          break;
        case "email":
          if (!emailRegex.test(newValue)) {
            errorMessage = "Invalid email format";
          }
          break;
      }
    }
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, [name]: errorMessage };
      const allValid = Object.values(updatedErrors).every(
        (error) => error === ""
      );
      setIsFormValid(allValid);
      return updatedErrors;
    });
  };
  const checkAvailability = async (field, value) => {
    if (
      (field == "username" && value != userData.username) ||
      (field == "email" && userData.email != value)
    ) {
      try {
        const response = await axios.get(
          `https://api-generator.retool.com/D8TEH0/data?${field}=${value}`
        );
        const data = response.data;
        if (field === "username") {
          if (userNameReg.test(value)) {
            setUsernameExists(data.length > 0);
            setErrors((prevErrors) => ({
              ...prevErrors,
              username: data.length > 0 ? "Username already exists" : "",
            }));
          }
        } else if (field === "email") {
          setEmailExists(data.length > 0);
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: data.length > 0 ? "Email already exists" : "",
          }));
        }
        if (data.length > 0) {
          setIsFormValid(false);
        }
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
    axios
      .get(`https://api-generator.retool.com/D8TEH0/data/${params.user_id}`)
      .then((res) => {
        setUserData(res.data);
        setFormValues(res.data);
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
    console.log(userData.password);
    console.log(newPassword.password);
    let newFormValues = { ...formValues };
    if (newPassword.newPassword == "") {
      setFormValues({ ...formValues, password: userData.password });
      newFormValues = { ...formValues, password: userData.password };
    } else {
      newFormValues = { ...formValues, password: newPassword.newPassword };
    }
    console.log(userData.password);
    
    if (userData.password == newPassword.password) {
      if (isFormValid) {
        console.log(newFormValues);
        
        axios
          .put(
            `https://api-generator.retool.com/D8TEH0/data/${params.user_id}`,
            newFormValues
          )
          .then((res) => {
            console.log(res.data);
            setShowSuccess(true);
            setShowError(false);
            setUserData(res.data);
            setShow(true);
            setShowModal(false);
          })
          .catch((error) => {
            console.log(error);
            setShowSuccess(false);
            setShowError(true);
          });
      }
    } else {
      setPwdError("incorrect Password! Please Try Again..");
    }
  };
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };
  const handleShow = () => setShowModal(true);
  return (
    <>
      <Row className="justify-content-center mt-5">
        <Col md={24}>
          <Card className="shadow-lg p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title className="text-center">User Information</Card.Title>
              {isLoading ? (
                <div>
                  <Card className="shadow-lg p-3 mb-5 bg-white rounded"></Card>
                  <Placeholder xs={6} />
                  <Placeholder className="w-75" />
                  <Placeholder style={{ width: "25%" }} />
                </div>
              ) : (
                <>
                  <Form onSubmit={handleSubmit} autoComplete="off"></Form>
                  {showSuccess ? (
                    <Alert
                      variant="success"
                      onClose={() => setShow(false)}
                      dismissible
                    >
                      Your Data was Updated Successfully!
                    </Alert>
                  ) : (
                    ""
                  )}
                  {showError ? (
                    <Alert
                      variant="danger"
                      dismissible
                      onClose={() => setShow(false)}
                    >
                      Error Updating your data!, please try again..
                    </Alert>
                  ) : (
                    ""
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        name="username"
                        placeholder="1234 Main St"
                        value={formValues.username}
                        onChange={handleChange}
                        feedback={errors.username}
                        onBlur={handleBlur}
                        isInvalid={!!errors.username}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                      <Form.Label>E-mail Address</Form.Label>
                      <Form.Control
                        name="email"
                        placeholder="Enter Your Email Address"
                        value={formValues.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.email}
                        feedback={errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row className="mb-3 border border-2 rounded-3 p-3">
                      <h3>Update Password </h3>
                      {/* <Form.Group as={Col} controlId="formGridCity">
                                                <Form.Label>Current Password</Form.Label>
                                                <InputGroup className="mb-3">
                                                    <Form.Control
                                                        name='password'
                                                        type={isVisibleOld ? 'text' : 'password'}
                                                        feedback={errors.password}
                                                        onSubmit={handlePassword}
                                                        onChange={handlePassword}
                                                        isInvalid={!!errors.password}
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        id="button-addon2"
                                                        onClick={() => setIsVisibleOld(!isVisibleOld)}
                                                    >
                                                        {isVisibleOld ?
                                                            <FaEyeSlash />
                                                            :
                                                            <FaEye />
                                                        }
                                                    </Button>
                                                </InputGroup>
                                            </Form.Group> */}
                      {/* {pwdError && (<Alert variant='danger'>
                                                {pwdError}
                                            </Alert>)} */}
                      <Form.Group controlId="formGridCity" className="w-100">
                        <Form.Label>New Password</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control
                            name="newPassword"
                            type={isVisible ? "text" : "password"}
                            placeholder="Password"
                            aria-describedby="basic-addon2"
                            onChange={handlePassword}
                            isInvalid={!!errors.newPassword}
                            feedback={errors.newPassword}
                          />
                          <Button
                            variant="outline-secondary"
                            id="button-addon2"
                            onClick={() => setIsVisible(!isVisible)}
                          >
                            {isVisible ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                          <Form.Control.Feedback type="invalid">
                            {errors.newPassword}
                          </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Label>Repeat Password</Form.Label>
                        <InputGroup className="mb-3">
                          <Form.Control
                            name="confirmPassword"
                            type={isVisibleConf ? "text" : "password"}
                            placeholder="Password"
                            aria-describedby="basic-addon2"
                            onChange={handlePassword}
                            isInvalid={!!errors.confirmPassword}
                            feedback={errors.confirmPassword}
                          />
                          <Button
                            variant="outline-secondary"
                            id="button-addon2"
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
                      disabled={
                        !isFormValid ||
                        (userData.username == formValues.username &&
                          userData.email == formValues.email &&
                          (newPassword.newPassword !=
                            newPassword.confirmPassword ||
                            newPassword.newPassword == ""))
                      }
                    >
                      Submit
                    </Button>
                    <Modal show={showModal} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form.Group as={Col} controlId="formGridCity">
                          <Form.Label>Current Password</Form.Label>
                          {pwdError && (
                            <Alert variant="danger" dismissible={false}>
                              {pwdError}
                            </Alert>
                          )}
                          <InputGroup className="mb-3">
                            <Form.Control
                              name="password"
                              type={isVisibleOld ? "text" : "password"}
                              feedback={errors.password}
                              onChange={handlePassword}
                              isInvalid={!!errors.password}
                            />
                            <Button
                              variant="outline-secondary"
                              id="button-addon2"
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
                          type="submit"
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
    </>
  );
}
