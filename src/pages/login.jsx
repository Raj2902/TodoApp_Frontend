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

  function isValidEmail(email) {
    // Regular expression to match a basic email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  const forgotPass = async () => {
    let decission = prompt(
      "Are you sure you want to change your password? If yes, please enter the email below."
    );
    if (isValidEmail(decission)) {
      localStorage.setItem("emailEntered", decission);
      await fetch(`${process.env.REACT_APP_API_URL}/send-mail/${decission}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then(async (response) => {
          if (response.ok) return response.json();
          else {
            let data = await response.json();
            //console.log(data);
            alert(data.message);
            throw new Error(data);
          }
        })
        .then((result) => {
          alert(result.message);
        })
        .catch((err) => {
          //console.log(err);
        });
    } else {
      alert("Invalid email!!!");
    }
  };

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
          let data = await response.json();
          throw new Error(`HTTP error: ${response.status} ${data.message}`);
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
          <button
            type="button"
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
              backgroundColor: "unset",
              border: "none",
            }}
            onClick={forgotPass}
          >
            Forgot Password?
          </button>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}
