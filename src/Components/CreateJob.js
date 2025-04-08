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
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  AxiosProjectsInstance,
  AxiosSkillsInstance,
} from "../network/API/AxiosInstance";

// Define initial form state and validation rules
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

// Component definition and state management hooks
const ClientJobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getFromLocalStorage("auth");

  const updateMode = location.state?.jobData ? true : false;
  const jobData = updateMode ? location.state.jobData : null;
  const isOngoingAndUneditable =
    updateMode && jobData?.project_state === "ongoing";

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [initialData, setInitialData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Functions for form validation
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

  // Functions for handling form data changes and preparing payload
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
    project_name: formData.project_name.trim(),
    project_description: formData.project_description.trim(),
    suggested_budget: Number(formData.suggested_budget),
    expected_deadline: Number(formData.expected_deadline),
    skills_ids: skillsOptions
      .filter((skill) => formData.requiredSkills.includes(skill.skill))
      .map((skill) => skill.id),
  });

  // Functions for handling API interactions (submit, update, cancel)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const payload = { ...createPayload(), project_state: "open" };
      await AxiosProjectsInstance.post("create/", payload, {
        headers: {
          Authorization: `Bearer ${user.user.access}`,
        },
      });
      setMessage("Job Created successfully");
      setTimeout(() => {
        navigate("/Freelancia-Front-End/clientjoblist");
      }, 1000);
      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Failed to post job.");
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
      await AxiosProjectsInstance.patch(`/${jobId}`, createPayload(), {
        headers: {
          Authorization: `Bearer ${user.user.access}`,
        },
      });
      setMessage("Job Updated successfully");
      setInitialData({ ...formData });
      setTimeout(() => {
        navigate("/Freelancia-Front-End/clientjoblist");
      }, 1000);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Failed to update job.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelJob = async (jobId, cancelType = null) => {
    setSubmitting(true);
    setMessage("");

    try {
      let newJobState = "canceled";
      if (jobData.project_state === "ongoing" && cancelType === "contract") {
        newJobState = "contract canceled and reopened";
      }

      await AxiosProjectsInstance.patch(
        `/${jobId}`,
        { project_state: newJobState },
        {
          headers: {
            Authorization: `Bearer ${user.user.access}`,
          },
        }
      );

      setMessage(
        newJobState === "canceled"
          ? "Job canceled successfully"
          : "Contract canceled successfully, job reopened"
      );
      setShowCancelModal(false);
      setTimeout(() => {
        navigate("/Freelancia-Front-End/clientjoblist");
      }, 1000);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "Failed to cancel job.");
    } finally {
      setSubmitting(false);
    }
  };

  // Effect hooks for fetching initial data and handling updates
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
      const currentSkills = jobData.required_skills || [];
      const newFormData = {
        project_name: jobData.project_name || "",
        suggested_budget: jobData.suggested_budget || "",
        expected_deadline: jobData.expected_deadline || "",
        project_description: jobData.project_description || "",
        requiredSkills: currentSkills,
      };
      setFormData(newFormData);
      setInitialData(newFormData);
    } else {
      setFormData(INITIAL_FORM_STATE);
      setInitialData(null);
    }
  }, [updateMode, jobData]);

  // Utility function to check if form data has changed from initial state
  const isDataChanged = () => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  // Authentication and authorization checks
  if (!user?.user?.access) return <Navigate to="/Freelancia-Front-End/login" />;
  if (user.user.role !== "client")
    return <Navigate to="/Freelancia-Front-End/403" />;

  // Function to render the skills selection section
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
          disabled={isOngoingAndUneditable}
        >
          <option value="">Select a skill</option>
          {Array.isArray(skillsOptions) &&
            skillsOptions.map((skill) => (
              <option key={skill.id} value={skill.skill}>
                {skill.skill}
              </option>
            ))}
        </Form.Control>
        <Button
          variant="secondary"
          onClick={handleAddSkill}
          disabled={isOngoingAndUneditable}
        >
          Add
        </Button>
      </InputGroup>
      {errors.requiredSkills && (
        <div className="invalid-feedback d-block">{errors.requiredSkills}</div>
      )}
      <Form.Control
        type="text"
        readOnly
        value={formData.requiredSkills.join(", ")}
        className="mt-2 bg-light"
      />
    </Form.Group>
  );

  // Function to render the cancel confirmation modal
  const renderCancelModal = () => (
    <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Cancelation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {jobData?.project_state === "ongoing"
          ? "Do you want to end the contract with the current freelancer and reopen the job, or do you want to cancel the job entirely?"
          : "Are you sure you want to cancel this job?"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
          No
        </Button>
        {jobData?.project_state === "ongoing" ? (
          <>
            <Button
              variant="warning"
              onClick={() => handleCancelJob(jobData.id, "contract")}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "End Contract & Reopen"}
            </Button>
            <Button
              variant="danger"
              onClick={() => handleCancelJob(jobData.id, "full")}
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Cancel Job Entirely"}
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

  // Main component render method
  return (
    <Container className="mt-5 mb-5">
      <h2>{updateMode ? "Update Your Job" : "Post a Job"}</h2>

      {isOngoingAndUneditable && (
        <Alert variant="info" className="mb-3">
          This job is currently ongoing and cannot be edited or canceled.
        </Alert>
      )}

      {message && (
        <Alert
          variant={message.includes("success") ? "success" : "danger"}
          className="mb-3"
        >
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
          disabled={isOngoingAndUneditable}
        />
        <InputFieldForJobCreate
          label="Suggested Budget ($)"
          name="suggested_budget"
          type="number"
          value={formData.suggested_budget}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (["-", "e", "E", "+"].includes(e.key)) e.preventDefault();
          }}
          min="1"
          error={errors.suggested_budget}
          disabled={isOngoingAndUneditable}
        />
        <InputFieldForJobCreate
          label="Expected Deadline (Days)"
          name="expected_deadline"
          type="number"
          value={formData.expected_deadline}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (["-", "e", "E", "+", "."].includes(e.key)) e.preventDefault();
          }}
          min="1"
          max="100"
          error={errors.expected_deadline}
          disabled={isOngoingAndUneditable}
        />
        <InputFieldForJobCreate
          label="Project Description"
          name="project_description"
          type="text"
          value={formData.project_description}
          onChange={handleChange}
          error={errors.project_description}
          as="textarea"
          rows={4}
          disabled={isOngoingAndUneditable}
        />

        {renderSkillsSection()}

        <div className="d-flex justify-content-start gap-2">
          {updateMode ? (
            <>
              <Button
                variant="primary"
                type="submit"
                disabled={
                  submitting || !isDataChanged() || isOngoingAndUneditable
                }
              >
                {submitting ? "Updating..." : "Update Job"}
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowCancelModal(true)}
                disabled={submitting || isOngoingAndUneditable}
              >
                {submitting ? "Processing..." : "Cancel Job"}
              </Button>
            </>
          ) : (
            <Button variant="success" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Post Job"}
            </Button>
          )}
        </div>
      </Form>

      {updateMode && jobData && renderCancelModal()}
    </Container>
  );
};

export default ClientJobForm;
