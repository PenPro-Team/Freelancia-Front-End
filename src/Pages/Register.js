import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  Container,
  Card,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { EyeSlash, Eye } from "react-bootstrap-icons";
import InputField from "../Components/InputField";
import HeaderColoredText from "../Components/HeaderColoredText";
import { AxiosUserInstance } from "../network/API/AxiosInstance";

const RegisterForm = () => {
  // --- Component State ---
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState({
    loading: false,
    exists: false,
  });
  const [emailCheck, setEmailCheck] = useState({
    loading: false,
    exists: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // --- Constants and Regex ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const robustPasswordRegex = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const userNameReg = /^[a-z0-9\._]{3,}$/;
  const lettersOnlyRegex = /^[a-zA-Z]+$/;
  const numbersOnlyRegex = /^\d+$/;
  const today = new Date();
  const maxBirthDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // --- Validation Logic ---
  const validateField = useCallback(
    (
      name,
      value,
      currentFormValues,
      currentUsernameExists,
      currentEmailExists
    ) => {
      let errorMsg = "";
      const trimmedValue = typeof value === "string" ? value.trim() : value;

      if (
        touched[name] &&
        !trimmedValue &&
        name !== "password" &&
        name !== "confirmPassword"
      ) {
        // Allow spaces temporarily in password fields during typing
        errorMsg = "This field is required";
      } else if (
        touched[name] &&
        (name === "password" || name === "confirmPassword") &&
        !value
      ) {
        // Check raw value for password required
        errorMsg = "This field is required";
      } else if (
        trimmedValue ||
        ((name === "password" || name === "confirmPassword") && value)
      ) {
        // Proceed validation if there is value
        switch (name) {
          case "firstName":
          case "lastName":
            if (!lettersOnlyRegex.test(trimmedValue)) {
              errorMsg = "Only letters are allowed";
            }
            break;
          case "username":
            if (!userNameReg.test(trimmedValue)) {
              errorMsg =
                "Username must be at least 3 characters (letters, numbers, '.', '_').";
            } else if (currentUsernameExists) {
              errorMsg = "Username already exists";
            }
            break;
          case "email":
            if (!emailRegex.test(trimmedValue)) {
              errorMsg = "Invalid email format";
            } else if (currentEmailExists) {
              errorMsg = "Email already exists";
            }
            break;
          case "password":
            if (!robustPasswordRegex.test(value)) {
              errorMsg = "Password: 8+ chars, upper, lower, digit, no spaces.";
            }
            break;
          case "confirmPassword":
            if (value !== currentFormValues.password) {
              errorMsg = "Passwords do not match";
            }
            break;
          case "birthdate":
            if (!trimmedValue) {
              // Check again if required validation didn't catch it (e.g., not touched yet but submitted)
              errorMsg = "This field is required";
            } else {
              const selectedDate = new Date(trimmedValue);
              const maxDate = new Date(maxBirthDate);
              if (selectedDate > maxDate) {
                errorMsg = "You must be at least 18 years old";
              }
            }
            break;
          case "postalCode":
            if (!numbersOnlyRegex.test(trimmedValue)) {
              errorMsg = "Postal code must contain only numbers";
            }
            break;
          case "address":
            if (trimmedValue.length < 10) {
              errorMsg = "Address must be at least 10 characters long";
            }
            break;
          case "role":
            if (!trimmedValue) {
              errorMsg = "Please select a role";
            } else if (
              trimmedValue !== "client" &&
              trimmedValue !== "freelancer"
            ) {
              errorMsg = "Please select a valid role";
            }
            break;
          default:
            break;
        }
      }
      return errorMsg;
    },
    [touched, maxBirthDate]
  ); // Include dependencies used inside useCallback

  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "username") {
      processedValue = value.replace(/\s+/g, "").replace(/[^a-z0-9._]/gi, "");
    }

    const newFormValues = { ...formValues, [name]: processedValue };
    setFormValues(newFormValues);

    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }

    const error = validateField(
      name,
      processedValue,
      newFormValues,
      usernameCheck.exists,
      emailCheck.exists
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

    if (name === "password" && formValues.confirmPassword) {
      const confirmPasswordError = validateField(
        "confirmPassword",
        formValues.confirmPassword,
        newFormValues,
        usernameCheck.exists,
        emailCheck.exists
      );
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: confirmPasswordError,
      }));
    }
    // Also validate password when confirmPassword changes
    if (name === "confirmPassword" && formValues.password) {
      const passwordError = validateField(
        "password",
        formValues.password,
        newFormValues,
        usernameCheck.exists,
        emailCheck.exists
      );
      setErrors((prevErrors) => ({ ...prevErrors, password: passwordError }));
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    const processedValue =
      name === "username"
        ? value.replace(/\s+/g, "").replace(/[^a-z0-9._]/gi, "")
        : value; // Process username again on blur if needed
    const trimmedValue =
      typeof processedValue === "string"
        ? processedValue.trim()
        : processedValue;

    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }

    // Use processedValue for validation, especially password which shouldn't be trimmed for regex check
    const formatError = validateField(
      name,
      processedValue,
      formValues,
      false,
      false
    );
    setErrors((prevErrors) => ({ ...prevErrors, [name]: formatError }));

    if (
      (name === "username" || name === "email") &&
      trimmedValue &&
      !formatError
    ) {
      const checkStateSetter =
        name === "username" ? setUsernameCheck : setEmailCheck;
      checkStateSetter({ loading: true, exists: false });

      try {
        const response = await AxiosUserInstance.get(
          `/?${name}=${trimmedValue}`
        );
        const isExists = response.data.length > 0;
        checkStateSetter({ loading: false, exists: isExists });

        const finalError = validateField(
          name,
          trimmedValue,
          formValues,
          name === "username" ? isExists : usernameCheck.exists,
          name === "email" ? isExists : emailCheck.exists
        );
        setErrors((prevErrors) => ({ ...prevErrors, [name]: finalError }));
      } catch (err) {
        console.error(`Error checking ${name} availability:`, err);
        checkStateSetter({ loading: false, exists: false });
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `Could not verify ${name}. Please try again.`,
        }));
      }
    } else if (name === "username" || name === "email") {
      const checkStateSetter =
        name === "username" ? setUsernameCheck : setEmailCheck;
      checkStateSetter({ loading: false, exists: false });
      // If formatError exists, keep it, otherwise clear if field is empty/invalid format
      if (!formatError) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear potential "Could not verify" error if now invalid/empty
      }
    } else {
      // For other fields, simply ensure validation runs on blur
      const error = validateField(
        name,
        processedValue,
        formValues,
        usernameCheck.exists,
        emailCheck.exists
      );
      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "confirmPassword",
      "birthdate",
      "postalCode",
      "address",
      "role",
    ];
    let isValid = true;

    // Check all fields for errors *and* ensure required fields have values
    for (const field of requiredFields) {
      // Run validation again for potentially untouched fields
      const error = validateField(
        field,
        formValues[field],
        formValues,
        usernameCheck.exists,
        emailCheck.exists
      );
      if (error) {
        isValid = false;
        // Update errors state for fields that might not have been touched/blurred
        if (!errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: error }));
        }
      }
      // Check if required field is actually filled (handles empty strings after trimming)
      const valueToCheck =
        field === "password" || field === "confirmPassword"
          ? formValues[field]
          : formValues[field]?.trim();
      if (!valueToCheck) {
        isValid = false;
        if (!errors[field] && touched[field]) {
          // Only show required if touched and validation didn't catch it
          setErrors((prev) => ({ ...prev, [field]: "This field is required" }));
        }
      }
    }

    const asyncChecksDone = !usernameCheck.loading && !emailCheck.loading;

    return isValid && asyncChecksDone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFieldsTouched = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allFieldsTouched);

    // Re-run validation logic for all fields before submitting
    if (!isFormValid()) {
      // isFormValid already updates the errors state if needed
      console.log("Form is invalid. Errors:", errors);
      setSnackbarMessage("Form Inputs Not Valid.");
      setShowSnackbar(true);
      return;
    }

    setIsLoading(true);

    try {
      const formData = {
        username: formValues.username.trim(),
        first_name: formValues.firstName.trim(),
        last_name: formValues.lastName.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        role: formValues.role,
        birth_date: formValues.birthdate,
        postal_code: formValues.postalCode.trim(),
        address: formValues.address.trim(),
      };

      const response = await AxiosUserInstance.post("", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registration response:", response);
      setSnackbarMessage("Registration successful! Redirecting to login...");
      setShowSnackbar(true);
      setTimeout(() => navigate("/Freelancia-Front-End/login"), 500);
    } catch (error) {
      console.error("Registration error:", error);
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        (error.response?.data && typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : null) ||
        "Registration failed! Please check your details and try again.";
      setSnackbarMessage(message);
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // --- JSX Structure ---
  return (
    <Container className="my-5 d-flex flex-column align-items-center">
      <HeaderColoredText text="Freelancia" />
      <Card className="shadow p-4" style={{ maxWidth: "800px", width: "100%" }}>
        <h3 className="text-center mb-4">Register</h3>
        <Form noValidate onSubmit={handleSubmit}>
          {/* Name Fields */}
          <Row>
            <Col md={6}>
              <InputField
                label="First Name"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.firstName && !!errors.firstName}
                feedback={errors.firstName}
                feedbackType="invalid"
              />
            </Col>
            <Col md={6}>
              <InputField
                label="Last Name"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.lastName && !!errors.lastName}
                feedback={errors.lastName}
                feedbackType="invalid"
              />
            </Col>
          </Row>

          {/* Username and Email Fields */}
          <InputField
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={
              touched.username && (!!errors.username || usernameCheck.loading)
            }
            feedback={
              errors.username ||
              (usernameCheck.loading ? "Checking availability..." : "")
            }
            feedbackType="invalid"
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched.email && (!!errors.email || emailCheck.loading)}
            feedback={
              errors.email ||
              (emailCheck.loading ? "Checking availability..." : "")
            }
            feedbackType="invalid"
          />

          {/* Password Fields */}
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formValues.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.password && !!errors.password}
                placeholder="Enter password"
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                placeholder="Confirm password"
              />
              <Button
                variant="outline-secondary"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeSlash /> : <Eye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Personal Info Fields */}
          <InputField
            label="Birthdate"
            type="date"
            name="birthdate"
            value={formValues.birthdate}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched.birthdate && !!errors.birthdate}
            feedback={errors.birthdate}
            feedbackType="invalid"
            max={maxBirthDate}
          />
          <InputField
            label="Postal Code"
            name="postalCode"
            value={formValues.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched.postalCode && !!errors.postalCode}
            feedback={errors.postalCode}
            feedbackType="invalid"
          />
          <InputField
            label="Address"
            name="address"
            value={formValues.address}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched.address && !!errors.address}
            feedback={errors.address}
            feedbackType="invalid"
          />

          {/* Role Selection */}
          <InputField
            label="Role"
            as="select"
            name="role"
            value={formValues.role}
            onChange={handleChange}
            onBlur={handleBlur}
            isInvalid={touched.role && !!errors.role}
            feedback={errors.role}
            feedbackType="invalid"
          >
            <option value="" disabled>
              Select Role...
            </option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </InputField>

          {/* Submission Area */}
          <div className="d-flex justify-content-center mt-4">
            {isLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <Button
                variant="primary"
                type="submit"
                className="w-75"
                disabled={
                  usernameCheck.loading || emailCheck.loading || isLoading
                } // Simplified disabled logic, relies on isFormValid check within handleSubmit
              >
                Register
              </Button>
            )}
          </div>

          {/* Feedback Snackbar */}
          {showSnackbar && (
            <Alert
              variant={
                snackbarMessage.startsWith("Registration successful")
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

          {/* Login Link */}
          <div className="text-center mt-3">
            <p>
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
