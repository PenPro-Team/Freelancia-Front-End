import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Importing icons
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Redux/Actions/authAction";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSpin, setisSpin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const history = useHistory();

  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation regex (8+ chars, uppercase, lowercase, number, special char)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    setisSpin(true);

    if (!email || !password || !isEmailValid || !isPasswordValid) {
      setError("Please enter valid email and password.");
      setisSpin(false);
      return;
    }

    try {
      const response = await axios.get(
        "https://api-generator.retool.com/D8TEH0/data",
        {
          params: { email, password },
        }
      );

      if (response.data.length > 0) {
        dispatch(loginSuccess(response.data[0]));
        setError("");
        setIsLoading(true);
        history.push(""); // Redirect to dashboard
      } else {
        setError("Invalid email or password");
        setIsLoading(false);
      }
      setisSpin(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f2f4f7" }}>
      <div className="container ">
        <div
          className="row justify-content-center align-items-center "
          style={{ height: "100vh" }}
        >
          <div className="col-md-6">
            <Card className="p-4 border-0 shadow">
              {error && <Alert variant="danger">{error}</Alert>}
              {isLoading && <Alert variant="success">Login successful</Alert>}
              <Card.Header>Login</Card.Header>
              <Card.Body>
                <Form noValidate onSubmit={HandleSubmit}>
                  {/* Email Field */}
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      className={
                        emailTouched
                          ? isEmailValid
                            ? "is-valid"
                            : "is-invalid"
                          : ""
                      }
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email.
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Password Field with Eye Icon */}
                  <Form.Group controlId="password" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setPasswordTouched(true)}
                        className={
                          passwordTouched
                            ? isPasswordValid
                              ? "is-valid"
                              : "is-invalid"
                            : ""
                        }
                        required
                      />
                      <Button
                        variant="outline-secondary rounded-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <AiFillEyeInvisible size={20} />
                        ) : (
                          <AiFillEye size={20} />
                        )}
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 8 characters, include an
                        uppercase, lowercase and number.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <p className="mt-3">
                    Don't have an account?{" "}
                    <Link to="/Freelancia-Front-End/register">Register</Link>
                  </p>

                  {isSpin ? (
                    <div className="d-flex justify-content-center">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
                    <Button
                      style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                      type="submit"
                      className="w-100 mt-3 btn btn-primary"
                      disabled={!isEmailValid || !isPasswordValid}
                    >
                      Login
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
