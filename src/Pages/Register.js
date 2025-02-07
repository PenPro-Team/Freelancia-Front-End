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
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "username" || name === "email") {
      checkAvailability(name, value);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "username") {
      newValue = value.replace(/\s+/g, "").replace(/[^a-z0-9._]/gi, "");
    }

    setFormValues({ ...formValues, [name]: newValue });

    if (newValue.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "This field is required",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const checkAvailability = async (field, value) => {
    try {
      const response = await axios.get(
        `https://api-generator.retool.com/D8TEH0/data?${field}=${value}`
      );
      const data = response.data;

      if (field === "username") {
        setUsernameExists(data.length > 0);
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: data.length > 0 ? "Username already exists" : "",
        }));
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

  const validate = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    Object.keys(formValues).forEach((key) => {
      if (!formValues[key]) {
        tempErrors[key] = "This field is required";
      }
    });

    if (formValues.email && !emailRegex.test(formValues.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (formValues.password && !passwordRegex.test(formValues.password)) {
      tempErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long";
    }

    if (formValues.confirmPassword !== formValues.password)
      tempErrors.confirmPassword = "Passwords do not match";
    if (formValues.description.length < 200)
      tempErrors.description = "Must be at least 200 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
      setTimeout(() => history.push("/login"), 2000);
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
          <Button variant="primary" type="submit" className="w-75 mt-3">
            Register
          </Button>
        </Form>
        {showSnackbar && (
          <Alert variant="" className="mt-3">
            {snackbarMessage}
          </Alert>
        )}
      </Card>
    </Container>
  );
};
export default RegisterForm;
