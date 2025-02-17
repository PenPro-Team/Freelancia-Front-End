import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, InputGroup } from "react-bootstrap";
import InputFieldForJobCreate from "./InputFieldForJobCreate";
import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from "../network/local/LocalStorage";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

const getUser = () => {
  return getFromLocalStorage("auth");
};

const ClientJobForm = () => {
  const history = useHistory();
  const user = getUser();

  const [formData, setFormData] = useState({
    project_name: "",
    suggested_budget: "",
    expected_deadline: "",
    project_description: "",
    requiredSkills: [],
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "project_name":
        if (!value || value.trim().length < 3) {
          error = "Project Name must be at least 3 characters";
        }
        break;
      case "suggested_budget":
        if (!value || isNaN(value) || Number(value) <= 0) {
          error = "Price must be a valid number greater than 0";
        }
        break;
      case "expected_deadline":
        if (!value) {
          error = "Deadline is required";
        }
        break;
      case "project_description":
        if (!value || value.trim().length < 10) {
          error = "Description must be at least 10 characters";
        }
        break;
      default:
        break;
    }
    return error;
  };

  useEffect(() => {
    axios
      .get("https://api-generator.retool.com/CGw7tS/skills")
      .then((response) => {
        setSkillsOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleAddSkill = () => {
    if (selectedSkill && !formData.requiredSkills.includes(selectedSkill)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, selectedSkill],
      }));
      setSelectedSkill("");
      setErrors((prev) => ({ ...prev, requiredSkills: "" }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.project_name = validateField(
      "project_name",
      formData.project_name
    );
    tempErrors.suggested_budget = validateField(
      "suggested_budget",
      formData.suggested_budget
    );
    tempErrors.expected_deadline = validateField(
      "expected_deadline",
      formData.expected_deadline
    );
    tempErrors.project_description = validateField(
      "project_description",
      formData.project_description
    );
    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      tempErrors.requiredSkills = "Required Skills are required";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMessage("");
    try {
      const payload = {
        project_name: formData.project_name,
        suggested_budget: formData.suggested_budget,
        expected_deadline: formData.expected_deadline,
        project_description: formData.project_description,
        required_skills: formData.requiredSkills.join(", "),
        job_state: "open",
        owner_id: user.user.id,
      };
      // await axios.delete(
      //   "https://api-generator.retool.com/6wGsbQ/projects/80"
      // );
      await axios.post(
        "https://api-generator.retool.com/6wGsbQ/projects",
        payload
      );
      setMessage("Job Created successfully");
      setFormData({
        project_name: "",
        suggested_budget: "",
        expected_deadline: "",
        project_description: "",
        requiredSkills: [],
      });
    } catch (error) {
      setMessage("Failed to post job.");
    }
    setSubmitting(false);
  };
  //   console.log(user.user.id);
  const user_dont_exist = getFromLocalStorage("auth");

  if (!user_dont_exist || !user_dont_exist.user) {
    return <Redirect to="/unauthrizedpage" />;
  }
  if (!user || user.user.role != "client") {
    return <Redirect to="/unauthrizedpage" />;
  }

  return (
    <Container className="mt-5">
      <h2>Post a Job</h2>
      {message && <div className="mb-3">{message}</div>}
      <Form noValidate onSubmit={handleSubmit}>
        <InputFieldForJobCreate
          label="Project Name"
          name="project_name"
          type="text"
          value={formData.project_name}
          onChange={handleChange}
          error={errors.project_name}
        />
        <InputFieldForJobCreate
          label="Price"
          name="suggested_budget"
          type="number"
          value={formData.suggested_budget}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (["-", "e", "E"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          error={errors.suggested_budget}
        />
        <InputFieldForJobCreate
          label="Deadline"
          name="expected_deadline"
          type="date"
          value={formData.expected_deadline}
          onChange={handleChange}
          error={errors.expected_deadline}
        />
        <InputFieldForJobCreate
          label="Description"
          name="project_description"
          type="text"
          value={formData.project_description}
          onChange={handleChange}
          error={errors.project_description}
          as="textarea"
          rows={3}
        />
        <Form.Group controlId="requiredSkills" className="mb-3">
          <Form.Label>Required Skills</Form.Label>
          <InputGroup>
            <Form.Control
              as="select"
              name="selectedSkill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              isInvalid={!!errors.requiredSkills}
            >
              <option value="">Select a skill</option>
              {skillsOptions.map((skill) => (
                <option key={skill.id} value={skill.skill}>
                  {skill.skill}
                </option>
              ))}
            </Form.Control>
            <Button variant="secondary" onClick={handleAddSkill}>
              Add
            </Button>
          </InputGroup>
          <Form.Control.Feedback type="invalid">
            {errors.requiredSkills}
          </Form.Control.Feedback>
          <Form.Control
            type="text"
            readOnly
            value={formData.requiredSkills.join(", ")}
            className="mt-2"
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </Container>
  );
};

export default ClientJobForm;
