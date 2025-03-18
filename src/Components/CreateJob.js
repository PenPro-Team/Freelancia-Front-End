import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  InputGroup,
  Modal,
  Alert,
} from "react-bootstrap";
import InputFieldForJobCreate from "./InputFieldForJobCreate";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import {
  AxiosProjectsInstance,
  AxiosSkillsInstance,
} from "../network/API/AxiosInstance";

// Constants
const INITIAL_FORM_STATE = {
  project_name: "",
  suggested_budget: "",
  expected_deadline: "",
  project_description: "",
  requiredSkills: [],
};

const VALIDATION_RULES = {
  project_name: (value) =>
    !value || value.trim().length < 3
      ? "Project Name must be at least 3 characters"
      : "",
  suggested_budget: (value) =>
    !value || isNaN(value) || Number(value) <= 0
      ? "Price must be a valid number greater than 0"
      : "",
  expected_deadline: (value) => {
    if (!value) return "Deadline is required";
    if (isNaN(value) || Number(value) < 1 || Number(value) > 100)
      return "Deadline must be a number between 1 and 100";
    return "";
  },
  project_description: (value) =>
    !value || value.trim().length < 10
      ? "Description must be at least 10 characters"
      : "",
};

const ClientJobForm = () => {
  // Hooks and State
  const history = useHistory();
  const location = useLocation();
  const user = getFromLocalStorage("auth");

  const updateMode = location.state?.jobData ? true : false;
  const jobData = updateMode ? location.state.jobData : null;

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [initialData, setInitialData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Validation Functions
  const validateField = (name, value) => VALIDATION_RULES[name]?.(value) || "";

  const validate = () => {
    const tempErrors = Object.keys(VALIDATION_RULES).reduce(
      (acc, field) => ({
        ...acc,
        [field]: validateField(field, formData[field]),
      }),
      {}
    );

    if (!formData.requiredSkills?.length) {
      tempErrors.requiredSkills = "Required Skills are required";
    }

    setErrors(tempErrors);
    return Object.values(tempErrors).every((err) => !err);
  };

  // Data Handling Functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const createPayload = () => ({
    owner_id: user.user.id,
    project_name: formData.project_name.trim(),
    project_description: formData.project_description.trim(),
    suggested_budget: Number(formData.suggested_budget),
    expected_deadline: Number(formData.expected_deadline),
    skills_ids: skillsOptions
      .filter((skill) => formData.requiredSkills.includes(skill.skill))
      .map((skill) => skill.id),
    project_state: "open",
  });

  // API Handling Functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMessage("");

    try {
      await AxiosProjectsInstance.post("create/", createPayload());
      setMessage("Job Created successfully");

      setTimeout(() => {
        history.push("/Freelancia-Front-End/clientjoblist");
      }, 1000);

      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setMessage("Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (jobId) => {
    if (!isDataChanged()) {
      setMessage("No changes made.");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    setMessage("");

    try {
      await AxiosProjectsInstance.patch(`/${jobId}`, createPayload());
      setMessage("Job Updated successfully");
      setInitialData({ ...formData });

      setTimeout(() => {
        history.push("/Freelancia-Front-End/clientjoblist");
      }, 1000);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setMessage("Failed to update job.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelJob = async (jobId, cancelType) => {
    setSubmitting(true);
    setMessage("");

    try {
      const newJobState =
        jobData.project_state === "ongoing" && cancelType
          ? cancelType === "contract"
            ? "contract canceled and reopened"
            : "canceled"
          : "canceled";

      await AxiosProjectsInstance.patch(`/${jobId}`, {
        project_state: newJobState,
        owner_id: user.user.id,
      });

      setMessage(
        newJobState === "canceled"
          ? "Job canceled successfully"
          : "Contract canceled successfully, job reopened"
      );
      setShowCancelModal(false);

      setTimeout(() => {
        history.push("/Freelancia-Front-End/clientjoblist");
      }, 1000);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setMessage("Failed to cancel job.");
    } finally {
      setSubmitting(false);
    }
  };

  // Effects
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await AxiosSkillsInstance.get("");
        setSkillsOptions(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    if (updateMode && jobData) {
      const processedSkills = Array.isArray(jobData.required_skills)
        ? jobData.required_skills.map((skill) => skill.skill || skill)
        : typeof jobData.required_skills === "string"
        ? jobData.required_skills.split(", ").filter((skill) => skill)
        : [];

      const newFormData = {
        project_name: jobData.project_name || "",
        suggested_budget: jobData.suggested_budget || "",
        expected_deadline: jobData.expected_deadline || "",
        project_description: jobData.project_description || "",
        requiredSkills: processedSkills,
      };

      setFormData(newFormData);
      setInitialData(newFormData);
    }
  }, [updateMode, jobData]);

  // Utility Functions
  const isDataChanged = () => {
    if (!initialData) return true;
    return Object.keys(INITIAL_FORM_STATE).some((key) =>
      key === "requiredSkills"
        ? formData[key].join(",") !== initialData[key].join(",")
        : formData[key] !== initialData[key]
    );
  };

  // Auth Check
  if (!user?.user) return <Redirect to="/Freelancia-Front-End/403" />;
  if (user.user.role !== "client")
    return <Redirect to="/Freelancia-Front-End/403" />;

  // Render Components
  const renderSkillsSection = () => (
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
  );

  const renderCancelModal = () => (
    <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Cancelation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {jobData?.job_state === "ongoing"
          ? "Do you want to end the contract with the current client and reopen the job, or do you want to cancel the job entirely?"
          : "Are you sure you want to cancel this job?"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
          No
        </Button>
        {jobData?.job_state === "ongoing" ? (
          <>
            <Button
              variant="warning"
              onClick={() => handleCancelJob(jobData.id, "contract")}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "End Contract & Reopen Job"}
            </Button>
            <Button
              variant="danger"
              onClick={() => handleCancelJob(jobData.id, "full")}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Cancel Job"}
            </Button>
          </>
        ) : (
          <Button
            variant="danger"
            onClick={() => handleCancelJob(jobData.id)}
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Yes, Cancel Job"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );

  return (
    <Container className="mt-5">
      <h2>{updateMode ? "Update Your Job" : "Post a Job"}</h2>
      {message && (
        <Alert variant="success" className="mb-3">
          {message}
        </Alert>
      )}

      <Form
        noValidate
        onSubmit={
          updateMode
            ? (e) => {
                e.preventDefault();
                handleUpdate(jobData.id);
              }
            : handleSubmit
        }
      >
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
            if (["-", "e", "E"].includes(e.key)) e.preventDefault();
          }}
          error={errors.suggested_budget}
        />
        <InputFieldForJobCreate
          label="Deadline"
          name="expected_deadline"
          type="number"
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

        {renderSkillsSection()}

        {updateMode ? (
          <>
            <Button
              variant="primary"
              type="submit"
              disabled={submitting || !isDataChanged()}
            >
              {submitting ? "Updating..." : "Update"}
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowCancelModal(true)}
              disabled={submitting}
              className="ml-2"
            >
              {submitting ? "Processing..." : "Cancel"}
            </Button>
          </>
        ) : (
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </Form>

      {updateMode && jobData && renderCancelModal()}
    </Container>
  );
};

export default ClientJobForm;
