import React, { useEffect, useState } from "react";
import "../css/login.css";
import Navbar from "../components/navbar";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePassword() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expire, setExpire] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTogglePasswordConfirmVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password === formData.confirm_password) {
      if (userId) {
        formData.code = code;
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
    }
  };

  const codeEmail = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/code-email/${code}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          setExpire(false);
          return response.json();
        } else {
          let data = await response.json();
          //console.log(data);
          //alert(data.error);
          setExpire(true);
          throw new Error(data);
        }
      })
      .then((result) => {
        setUserId(result.user_id);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("token"))
      navigate("/dashboard", { replace: true });
    else {
      codeEmail();
    }
  }, []);
  return (
    <>
      <Navbar />
      {expire ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10%",
          }}
        >
          <p
            style={{
              padding: "5% 10%",
              border: "10px solid #009ccc",
              textAlign: "center",
              fontSize: "x-large",
            }}
          >
            The link has been expired.&#128542;
          </p>
        </div>
      ) : (
        <div className="LoginForm">
          <form onSubmit={handleSubmit}>
            <label>
              Password:
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                required
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
            </label>
            <label>
              Confirm Password:
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                onChange={handleChange}
                required
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
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      )}
    </>
  );
}
