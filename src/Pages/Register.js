import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-bootstrap";
import { EyeSlash, Eye } from "react-bootstrap-icons";
import Spinner from "react-bootstrap/Spinner";
import InputField from "../Components/InputField";
import { Link } from "react-router-dom";
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosUserInstance } from "../network/API/AxiosInstance";

const RegisterForm = () => {
  const navigate = useNavigate();
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
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const robustPasswordRegex = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const userNameReg = /^[a-z0-9\._]{3,}$/;

  const [isLoading, setisLoading] = useState(false);

  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const maxBirthDate = `${year}-${month}-${day}`;

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (name === "username" || name === "email") {
      try {
        const response = await AxiosUserInstance.get(`?${name}=${value}`);
        const isExists = response.data.length > 0;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: isExists ? `${name} already exists` : "",
        }));
        name === "username" && setUsernameExists(isExists);
        name === "email" && setEmailExists(isExists);
      } catch (err) {
        console.error(`Error checking ${name} availability:`, err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value.trim();
    if (name === "username") {
      newValue = value.replace(/\s+/g, "").replace(/[^a-z0-9._]/gi, "");
    }
    setFormValues({ ...formValues, [name]: newValue });

    let errorMessage = "";
    if (newValue === "") {
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
              "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long, with no spaces.";
          }
          break;
        case "confirmPassword":
          if (newValue !== formValues.password) {
            errorMessage = "Passwords do not match";
          }
          break;
        case "birthdate":
          const selectedDate = new Date(newValue);
          const currentDate = new Date();
          const age = currentDate.getFullYear() - selectedDate.getFullYear();
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
          if (newValue.length < 5) {
            errorMessage = "Address must be at least 5 characters long";
          }
          break;
        case "role":
          if (
            newValue.toLowerCase() !== "client" &&
            newValue.toLowerCase() !== "freelancer"
          ) {
            errorMessage = "Please select a valid role";
          }
          break;
        case "username":
          if (!userNameReg.test(newValue)) {
            errorMessage =
              "Username must be at least 3 characters and follow the correct format.";
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

  const isFormValid =
    Object.values(errors).every((error) => error === "") &&
    Object.values(formValues).every((value) => value !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setisLoading(true);

      const formData = {
        username: formValues.username.trim(),
        first_name: formValues.firstName.trim(),
        last_name: formValues.lastName.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        role: formValues.role,
        birth_date: formValues.birthdate,
        postal_code: formValues.postalCode,
        address: formValues.address,
      };

      const response = await AxiosUserInstance.post("", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registration response:", response);

      setSnackbarMessage("Registration successful!");
      setShowSnackbar(true);
      setTimeout(() => navigate("/Freelancia-Front-End/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setSnackbarMessage(
        error.response?.data?.message || "Registration failed!"
      );
      setShowSnackbar(true);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <Container className="my-5 d-flex flex-column align-items-center">
      <HeaderColoredText text="Freelancia" />
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
            type="email"
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
            max={maxBirthDate}
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
            required
          >
            <option value="">Select Role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </InputField>
          {/* <InputField
            label="Description"
            as="textarea"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            isInvalid={Boolean(errors.description)}
            feedback={errors.description}
            rows={4}
          /> */}
          <div className="d-flex justify-content-center mt-2">
            {isLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button
                variant="primary"
                type="submit"
                className="w-75 mt-3"
                disabled={!isFormValid}
              >
                Register
              </Button>
            )}
          </div>
          {showSnackbar && (
            <Alert
              variant={
                snackbarMessage === "Registration successful!"
                  ? "success"
                  : "danger"
              }
              className="mt-3"
              onClose={() => setShowSnackbar(false)}
              dismissible
            >
              {snackbarMessage}
            </Alert>
          )}
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