import React from "react";
import { Form } from "react-bootstrap";

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
  return (
    <Form.Group controlId={name} className={className}>
      <Form.Label className="mb-1" style={{ fontSize: "0.875rem", fontWeight: "bold" }}>
        {label}
      </Form.Label>
      <Form.Control
        as={as}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={isInvalid}
        style={{ height: "38px" }}
        {...props}
      />
      <Form.Control.Feedback
        type="invalid"
        style={{ fontSize: "0.75rem", color: "#dc3545" }} // تقليل حجم النص وتغيير اللون
      >
        {feedback}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default InputField;
