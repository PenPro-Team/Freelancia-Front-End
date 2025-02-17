import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  isInvalid,
  feedback,
  className,
  as,
  ...props
}) => {
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

  return (
    <Form.Group controlId={name} className={className}>
      <Form.Label
        className="mb-1"
        style={{ fontSize: "0.875rem", fontWeight: "bold" }}
      >
        {label}
      </Form.Label>
      {isPasswordField ? (
        <InputGroup hasValidation>
          <Form.Control
            as={as}
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={isInvalid}
            style={{ height: "38px" }}
            {...props}
          />
          <InputGroup.Text
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </InputGroup.Text>
          <Form.Control.Feedback
            type="invalid"
            style={{ fontSize: "0.75rem", color: "#dc3545" }}
          >
            {feedback}
          </Form.Control.Feedback>
        </InputGroup>
      ) : (
        <>
          <Form.Control
            as={as}
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={isInvalid}
            style={{ height: "38px" }}
            {...props}
          />
          <Form.Control.Feedback
            type="invalid"
            style={{ fontSize: "0.75rem", color: "#dc3545" }}
          >
            {feedback}
          </Form.Control.Feedback>
        </>
      )}
    </Form.Group>
  );
};

export default InputField;
