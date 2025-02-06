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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "username" || name === "email") {
      checkAvailability(name, value);
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
      } else if (field === "email") {
        setEmailExists(data.length > 0);
      }
    } catch (error) {
      console.error(`Error checking ${field} availability:`, error);
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formValues.firstName) tempErrors.firstName = "First name is required";
    if (!formValues.lastName) tempErrors.lastName = "Last name is required";
    if (!formValues.username) tempErrors.username = "Username is required";
    if (!formValues.email) tempErrors.email = "Email is required";
    if (!formValues.password) tempErrors.password = "Password is required";
    if (formValues.password.length < 8)
      tempErrors.password = "Must be at least 8 characters";
    if (!formValues.confirmPassword)
      tempErrors.confirmPassword = "Confirm your password";
    if (formValues.confirmPassword !== formValues.password)
      tempErrors.confirmPassword = "Passwords do not match";
    if (!formValues.birthdate) tempErrors.birthdate = "Birthdate is required";
    if (!formValues.postalCode)
      tempErrors.postalCode = "Postal code is required";
    if (!formValues.address) tempErrors.address = "Address is required";
    if (!formValues.role) tempErrors.role = "Role selection is required";
    if (!formValues.description)
      tempErrors.description = "Description is required";
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
      const response = await axios.post(
        "https://api-generator.retool.com/D8TEH0/data",
        { ...formValues, confirmPassword: undefined },
        { headers: { "Content-Type": "application/json" } }
      );

      //   console.log("Form submitted successfully", response.data);
      setSnackbarMessage("Registration successful!");
      setShowSnackbar(true);

      setTimeout(() => {
        history.push("/login");  // هتحط هنا صفحة اللوجين بتاعتك 
      }, 2000);
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
            isInvalid={Boolean(errors.username) || usernameExists}
            feedback={
              usernameExists ? "Username already exists" : errors.username
            }
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            isInvalid={Boolean(errors.email) || emailExists}
            feedback={emailExists ? "Email already exists" : errors.email}
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
          <Alert variant="success" className="mt-3">
            {snackbarMessage}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default RegisterForm;
