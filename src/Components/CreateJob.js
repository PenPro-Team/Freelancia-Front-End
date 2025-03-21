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
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  AxiosProjectsInstance,
  AxiosSkillsInstance,
} from "../network/API/AxiosInstance";

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
  const navigate = useNavigate(); // Updated useHistory to useNavigate
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
    project_state: "open",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMessage("");

    try {
      await AxiosProjectsInstance.post("create/", createPayload(), {
        headers: {
          Authorization: `Bearer ${user.user.access}`,
        },
      });
      setMessage("Job Created successfully");

      setTimeout(() => {
        navigate("/Freelancia-Front-End/clientjoblist"); // Updated history.push
      }, 1000);

      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      setMessage("Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelJob = async (jobId, cancelType) => {
    try {
      const newJobState =
        jobData.project_state === "ongoing" && cancelType
          ? cancelType === "contract"
            ? "contract canceled and reopened"
            : "canceled"
          : "canceled";

      await AxiosProjectsInstance.patch(
        `/${jobId}`,
        {
          project_state: newJobState,
          owner_id: user.user.id,
        },
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
      setMessage("Failed to cancel job.");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!user?.user) return <Navigate to="/Freelancia-Front-End/403" replace />;
  if (user.user.role !== "client")
    return <Navigate to="/Freelancia-Front-End/403" replace />;

  return (
    <Container className="mt-5">
      <h2>{updateMode ? "Update Your Job" : "Post a Job"}</h2>
      {/* Form Section */}
    </Container>
  );
};

export default ClientJobForm;
