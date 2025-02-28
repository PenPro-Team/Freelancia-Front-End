import React, { useState, useEffect } from "react";
import { Form, Button, Container, InputGroup, Modal, Alert } from "react-bootstrap";
import InputFieldForJobCreate from "./InputFieldForJobCreate";
import { getFromLocalStorage } from "../network/local/LocalStorage";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { AxiosProjectsInstance, AxiosSkillsInstance } from "../network/API/AxiosInstance";

const getUser = () => {
  return getFromLocalStorage("auth");
};

const ClientJobForm = () => {
  const history = useHistory();
  const location = useLocation();
  const user = getUser();

  // Determine if we are in update mode based on the presence of job data
  const updateMode = location.state && location.state.jobData ? true : false;
  const jobData = updateMode ? location.state.jobData : null;

  const [formData, setFormData] = useState({
    project_name: "",
    suggested_budget: "",
    expected_deadline: "",
    project_description: "",
    requiredSkills: [],
  });
  // To store the original data when entering update mode
  const [initialData, setInitialData] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  // State for displaying the cancel confirmation modal
  const [showCancelModal, setShowCancelModal] = useState(false);

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
        } else if (isNaN(value) || Number(value) < 1 || Number(value) > 100) {
          error = "Deadline must be a number between 1 and 100";
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
    AxiosSkillsInstance.get("")
      .then((response) => {
        setSkillsOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
      });
  }, []);

  // Populate the form with existing data in update mode
  useEffect(() => {
    if (updateMode && jobData) {
      setFormData({
        project_name: jobData.project_name || "",
        suggested_budget: jobData.suggested_budget || "",
        expected_deadline: jobData.expected_deadline || "",
        project_description: jobData.project_description || "",
        requiredSkills: jobData.required_skills
          ? jobData.required_skills.split(", ").filter((skill) => skill)
          : [],
      });
      setInitialData({
        project_name: jobData.project_name || "",
        suggested_budget: jobData.suggested_budget || "",
        expected_deadline: jobData.expected_deadline || "",
        project_description: jobData.project_description || "",
        requiredSkills: jobData.required_skills
          ? jobData.required_skills.split(", ").filter((skill) => skill)
          : [],
      });
    }
  }, [updateMode, jobData]);

  // Reset the form for create mode
  useEffect(() => {
    if (!location.state || !location.state.jobData) {
      setFormData({
        project_name: "",
        suggested_budget: "",
        expected_deadline: "",
        project_description: "",
        requiredSkills: [],
      });
      setInitialData(null);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };
//-------------------------------------------------------------------
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
//-------------------------------------------------------------------
  const validate = () => {
    let tempErrors = {};
    tempErrors.project_name = validateField("project_name", formData.project_name);
    tempErrors.suggested_budget = validateField("suggested_budget", formData.suggested_budget);
    tempErrors.expected_deadline = validateField("expected_deadline", formData.expected_deadline);
    tempErrors.project_description = validateField("project_description", formData.project_description);
    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      tempErrors.requiredSkills = "Required Skills are required";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every((err) => !err);
  };

  // Check if data has changed in update mode
  const isDataChanged = () => {
    if (!initialData) return true;
    return (
      formData.project_name !== initialData.project_name ||
      formData.suggested_budget !== initialData.suggested_budget ||
      formData.expected_deadline !== initialData.expected_deadline ||
      formData.project_description !== initialData.project_description ||
      formData.requiredSkills.join(", ") !== initialData.requiredSkills.join(", ")
    );
  };

  // Function to create the job
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setMessage("");
    try {
      const date = new Date();
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = date.toLocaleDateString("en-US", options);

      const payload = {
        project_name: formData.project_name,
        suggested_budget: formData.suggested_budget,
        expected_deadline: formData.expected_deadline,
        creation_date: formattedDate,
        project_description: formData.project_description,
        required_skills: formData.requiredSkills.join(", "),
        // For testing purposes, job_state is set to "ongoing" temporarily
        // job_state: "ongoing",
        job_state: "open",
        owner_id: user.user.id,
      };

      await AxiosProjectsInstance.post("", payload);

      setMessage("Job Created successfully");

      // After one second, navigate to the job list page
      setTimeout(() => {
        history.push("/Freelancia-Front-End/clientjoblist");
      }, 1000);

      // Reset the form
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

  // Function to update the job
  const handleUpdate = async (jobId) => {
    if (!isDataChanged()) {
      setMessage("No changes made.");
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    setMessage("");
    try {
      await AxiosProjectsInstance.patch(`/${jobId}`, {
        project_name: formData.project_name,
        suggested_budget: formData.suggested_budget,
        expected_deadline: formData.expected_deadline,
        project_description: formData.project_description,
        required_skills: formData.requiredSkills.join(", "),
        // you can change it to ongoing to test the ongoing state on the joblisting page
        job_state: "open",
      });
      setMessage("Job Updated successfully");
      setInitialData({ ...formData });
    } catch (error) {
      setMessage("Failed to update job.");
    }
    setSubmitting(false);
  };

  // Function to cancel the job with different logic based on the job state
  const handleCancelJob = async (jobId, cancelType) => {
    setSubmitting(true);
    setMessage("");
    try {
      let newJobState;
      if (jobData.job_state === "ongoing" && cancelType) {
        if (cancelType === "contract") {
          newJobState = "contract canceled and reopened";
        } else if (cancelType === "full") {
          newJobState = "canceled";
        }
      } else {
        newJobState = "canceled";
      }
      await AxiosProjectsInstance.patch(`/${jobId}`, {
        job_state: newJobState,
      });
      setMessage(
        newJobState === "canceled"
          ? "Job canceled successfully"
          : "Contract canceled successfully, job reopened"
      );
      setShowCancelModal(false);
      history.push("/Freelancia-Front-End/clientjoblist");
    } catch (error) {
      setMessage("Failed to cancel job.");
    }
    setSubmitting(false);
  };

  if (!user || !user.user) {
    return <Redirect to="/Freelancia-Front-End/403" />;
  }
  if (!user || user.user.role !== "client") {
    return <Redirect to="/Freelancia-Front-End/403" />;
  }

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
            if (["-", "e", "E"].includes(e.key)) {
              e.preventDefault();
            }
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
        {updateMode ? (
          <>
            <Button variant="primary" type="submit" disabled={submitting || !isDataChanged()}>
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

      {/* Cancel confirmation modal */}
      {updateMode && jobData && (
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancelation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {jobData.job_state === "ongoing" ? (
              <p>
                Do you want to end the contract with the current client and reopen the job, or do you want to cancel the job entirely?
              </p>
            ) : (
              <p>Are you sure you want to cancel this job?</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              No
            </Button>
            {jobData.job_state === "ongoing" ? (
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
      )}
    </Container>
  );
};

export default ClientJobForm;
