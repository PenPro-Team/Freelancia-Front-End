import React from 'react';
import { Form } from 'react-bootstrap';

const InputField = ({ label, name, type, value, onChange, error, ...rest }) => {
  return (
    <Form.Group controlId={name} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        isInvalid={!!error}
        {...rest}
      />
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default InputField;
