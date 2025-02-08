const handleChange = (e) => {
  const { name, value } = e.target;
  let newValue = value;

  if (name === "firstName" || name === "lastName") {
    newValue = value.replace(/[^a-zA-Z0-9]/g, "");
  }

  setFormValues({ ...formValues, [name]: newValue });

  if (newValue.trim() === "") {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "This field is required",
    }));
  } else {
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  }
};

const validate = () => {
  const tempErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  Object.keys(formValues).forEach((key) => {
    if (!formValues[key]) {
      tempErrors[key] = "This field is required";
    }
  });

  if (!/^[a-zA-Z0-9]+$/.test(formValues.firstName)) {
    tempErrors.firstName = "Only letters and numbers are allowed";
  }

  if (!/^[a-zA-Z0-9]+$/.test(formValues.lastName)) {
    tempErrors.lastName = "Only letters and numbers are allowed";
  }

  if (formValues.email && !emailRegex.test(formValues.email)) {
    tempErrors.email = "Invalid email format";
  }

  if (formValues.password && !passwordRegex.test(formValues.password)) {
    tempErrors.password =
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long";
  }

  if (formValues.confirmPassword !== formValues.password) {
    tempErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};
