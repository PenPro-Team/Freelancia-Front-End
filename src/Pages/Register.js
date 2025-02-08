import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  Container,
  Card,
  InputGroup,
  EyeSlash,
  Eye,
} from "react-bootstrap";
import InputField from "../Components/InputField";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const RegisterForm = () => {
  const history = useHistory();
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    postalCode: "",
    address: "",
    role: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const robustPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const userNameReg = /^[a-z0-9\._]{3,}$/;

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "username" || name === "email") {
      checkAvailability(name, value);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "username") {
      newValue = value.replace(/\s+/g, "").replace(/[^a-z0-9._]/gi, "");
    }
    setFormValues({ ...formValues, [name]: newValue });

    let errorMessage = "";
    console.log(e.target.name);
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
        case "password":
          if (!robustPasswordRegex.test(newValue)) {
            errorMessage =
              "Password must contain at least one letter, one digit, and be at least 8 characters long";
          }
          break;
        case "confirmPassword":
          if (newValue !== formValues.password) {
            errorMessage = "Passwords do not match";
          }
          break;
        case "birthdate":
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
        case "role":
          if (newValue !== "client" && newValue !== "freelancer") {
            errorMessage = "Please select a valid role";
          }
          break;
        case "description":
          if (newValue.length < 200) {
            errorMessage = "Must be at least 200 characters";
          }
          break;
        case "username":
          if (!userNameReg.test(newValue)) {
            errorMessage = "Invalid username must be more than 3 char";
          }
          break;
        case "email":
          if (!emailRegex.test(newValue)) {
            errorMessage = "Invalid email format";
          }
          break;
        default:
          break;
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const checkAvailability = async (field, value) => {
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
    } catch (error) {
      console.error(`Error checking ${field} availability:`, error);
    }
  };

  const isFormValid =
    Object.values(errors).every((error) => error === "") &&
    Object.values(formValues).every((value) => value.trim() !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameExists || emailExists) {
      setSnackbarMessage("Username or Email already exists!");
      setShowSnackbar(true);
      return;
    }
    try {
      await axios.post(
        "https://api-generator.retool.com/D8TEH0/data",
        { ...formValues, confirmPassword: undefined },
        { headers: { "Content-Type": "application/json" } }
      );
      setSnackbarMessage("Registration successful!");
      setShowSnackbar(true);
      setTimeout(() => history.push("/login"), 2000); // هنا هتحط صفحة اللوجين بتاعتك
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <Card className="shadow p-4" style={{ maxWidth: "800px", width: "100%" }}>
        <h3 className="text-center mb-4">Register</h3>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <InputField
                label="First Name"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                isInvalid={Boolean(errors.firstName)}
                feedback={errors.firstName}
              />
            </Col>
            <Col>
              <InputField
                label="Last Name"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                isInvalid={Boolean(errors.lastName)}
                feedback={errors.lastName}
              />
            </Col>
          </Row>
          <InputField
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={Boolean(errors.username)}
            feedback={errors.username}
          />
          <InputField
            label="Email"
            type="text"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={Boolean(errors.email)}
            feedback={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            isInvalid={Boolean(errors.password)}
            feedback={errors.password}
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            isInvalid={Boolean(errors.confirmPassword)}
            feedback={errors.confirmPassword}
          />
          <InputField
            label="Birthdate"
            type="date"
            name="birthdate"
            value={formValues.birthdate}
            onChange={handleChange}
            isInvalid={Boolean(errors.birthdate)}
            feedback={errors.birthdate}
          />
          <InputField
            label="Postal Code"
            name="postalCode"
            value={formValues.postalCode}
            onChange={handleChange}
            isInvalid={Boolean(errors.postalCode)}
            feedback={errors.postalCode}
          />
          <InputField
            label="Address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            isInvalid={Boolean(errors.address)}
            feedback={errors.address}
          />
          <InputField
            label="Role"
            as="select"
            name="role"
            value={formValues.role}
            onChange={handleChange}
            isInvalid={Boolean(errors.role)}
            feedback={errors.role}
          >
            <option value="">Select Role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </InputField>
          <InputField
            label="Description"
            as="textarea"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            isInvalid={Boolean(errors.description)}
            feedback={errors.description}
            rows={4}
          />
          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              type="submit"
              className="w-75 mt-3"
              disabled={!isFormValid}
            >
              Register
            </Button>
          </div>
          <div>
            <p className="mt-3 d-flex justify-content-center">
              Already have an account?{" "}
              <Link to="/Freelancia-Front-End/login">Login</Link>
            </p>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterForm;
