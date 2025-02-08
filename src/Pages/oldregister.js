import { useState } from "react";

function Registerform() {
  const [userInfo, setUserInfo] = useState({
    name: null,
    email: null,
    username: null,
    password: null,
    confirmPassword: null,
  });

  const [errors, setErrors] = useState({
    errname: null,
    erremail: null,
    errusername: null,
    errpass: null,
    errconfirm: null,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  const [showPassword, setShowPassword] = useState(false);

  const handleforminput = (e) => {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });

    switch (name) {
      case "name":
        setErrors({
          ...errors,
          errname: value.length === 0 && "This field is required",
        });
        break;
      case "email":
        setErrors({
          ...errors,
          erremail:
            value.length === 0
              ? "This field is required"
              : !emailRegex.test(value) && "Invalid email format",
        });
        break;
      case "username":
        setErrors({
          ...errors,
          errusername:
            value.length === 0
              ? "This field is required"
              : /\s/.test(value) && "whitespaces are not allowed",
        });
        break;
      case "password":
        setErrors({
          ...errors,
          errpass:
            value.length === 0
              ? "This field is required"
              : !passwordRegex.test(value) &&
                "Password must have numbers and special characters and atleast be 8 chars ",
        });
        break;
      case "confirmPassword":
        setErrors({
          ...errors,
          errconfirm: value !== userInfo.password && "Passwords do not match",
        });
        break;
      default:
        break;
    }
  };

  const preventdefault = (e) => {
    e.preventDefault();
    // alert("Submitted")
  };

  return (
    <>
      <div className="container">
        <h1>Form</h1>
        <form onSubmit={(e) => preventdefault(e)}>
          {/* Name */}

          <div className="mb-3">
            <label htmlFor="nameInput" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="nameInput"
              name="name"
              onChange={(e) => handleforminput(e)}
            />
            <p className="text-danger">{errors.errname}</p>
          </div>

          {/* Email */}

          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              name="email"
              onChange={(e) => handleforminput(e)}
            />
            <p className="text-danger">{errors.erremail}</p>
          </div>

          {/* Username */}

          <div className="mb-3">
            <label htmlFor="usernameInput" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="usernameInput"
              name="username"
              onChange={(e) => handleforminput(e)}
            />
            <p className="text-danger">{errors.errusername}</p>
          </div>

          {/* Password */}

          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="passwordInput"
                name="password"
                onChange={(e) => handleforminput(e)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{ border: "none", background: "transparent" }}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                  style={{ cursor: "pointer" }}
                ></i>
              </button>
            </div>
            <p className="text-danger">{errors.errpass}</p>
          </div>

          {/* Confirm Password */}

          <div className="mb-3">
            <label htmlFor="confirmPasswordInput" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPasswordInput"
              name="confirmPassword"
              onChange={(e) => handleforminput(e)}
            />
            <p className="text-danger">{errors.errconfirm}</p>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Registerform;
