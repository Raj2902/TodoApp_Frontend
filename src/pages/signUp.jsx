import React, { useEffect, useState } from "react";
import "../css/login.css";
import NavbarComponent from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTogglePasswordConfirmVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  useEffect(() => {
    if (localStorage.getItem("token"))
      navigate("/dashboard", { replace: true });
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formErrors = {};
    if (formData.name === "") formErrors.name = "*Name is required.";
    if (formData.email === "") formErrors.email = "*Email is required.";
    if (formData.password === "")
      formErrors.password = "*Password is required.";
    if (formData.confirmPassword === "")
      formErrors.confirmPassword = "*Confirm Password is required.";
    if (formData.name !== "") formErrors.name = "";
    if (formData.email !== "") formErrors.email = "";
    if (!validateEmail(formData.email))
      formErrors.email = "*Invalid email address";
    if (formData.password !== "") formErrors.password = "";
    if (formData.confirmPassword !== "") formErrors.confirmPassword = "";
    if (formData.confirmPassword !== formData.password)
      formErrors.confirmPassword =
        "*Password and Confirm Password doesn't match.";
    if (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    ) {
      await fetch(`${process.env.REACT_APP_API_URL}/authentication/sign_up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return await response.json();
        })
        .then((data) => {
          alert(data.message);
          navigate("/login");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
    setErrors(formErrors);
  };

  return (
    <>
      <NavbarComponent />
      <div className="LoginForm">
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" onChange={handleChange} />
            {errors.name && <p className="errors">{errors.name}</p>}
          </label>
          <label>
            Email:
            <input type="email" name="email" onChange={handleChange} />
            {errors.email && <p className="errors">{errors.email}</p>}
          </label>
          <label>
            Password:
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
            />
            {showPassword ? (
              <FaEye
                style={{ cursor: "pointer" }}
                onClick={handleTogglePasswordVisibility}
              />
            ) : (
              <FaEyeSlash
                style={{ cursor: "pointer" }}
                onClick={handleTogglePasswordVisibility}
              />
            )}
            {errors.password && <p className="errors">{errors.password}</p>}
          </label>
          <label>
            Confirm Password:
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              onChange={handleChange}
            />
            {showConfirmPassword ? (
              <FaEye
                style={{ cursor: "pointer" }}
                onClick={handleTogglePasswordConfirmVisibility}
              />
            ) : (
              <FaEyeSlash
                style={{ cursor: "pointer" }}
                onClick={handleTogglePasswordConfirmVisibility}
              />
            )}
            {errors.confirmPassword && (
              <p className="errors">{errors.confirmPassword}</p>
            )}
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}
