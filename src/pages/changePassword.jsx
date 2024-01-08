import React, { useEffect, useState } from "react";
import "../css/login.css";
import Navbar from "../components/navbar";
import { useNavigate, useParams } from "react-router-dom";

export default function ChangePassword() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
    code: code,
    email: localStorage.getItem("emailEntered"),
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log("working", formData);
    if (formData.password === formData.confirm_password) {
      await fetch(
        `${process.env.REACT_APP_API_URL}/authentication/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then(async (response) => {
          if (!response.ok) {
            let data = await response.json();
            throw new Error(`HTTP error: ${response.status} ${data.message}`);
          }
          return await response.json();
        })
        .then((data) => {
          alert("Password Changed Successfully");
          navigate("/login", { replace: true });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
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
            Password:
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirm_password"
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
