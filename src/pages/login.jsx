import React, { useEffect, useState } from "react";
import "../css/login.css";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch(`${process.env.REACT_APP_API_URL}/authentication/login`, {
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
        localStorage.setItem("token", data.token);
        alert("Login Successfull");
        navigate("/dashboard");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("token"))
      navigate("/dashboard", { replace: true });
  });
  return (
    <>
      <Navbar />
      <div className="LoginForm">
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input type="email" name="email" onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}
