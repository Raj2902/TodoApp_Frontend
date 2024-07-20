import React, { useEffect, useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css";

export default function NavbarComponent() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
  });
  const [formData, setFormData] = useState();
  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const [showForm, setShowForm] = useState(false);
  const [hamburger, setHamburger] = useState(true);

  const getUsername = async () => {
    if (localStorage.getItem("token")) {
      await fetch(`${process.env.REACT_APP_API_URL}/authentication/user-name`, {
        method: "GET",
        headers: {
          authorization: `${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(async (data) => {
          let result = await data;
          setUser({ name: result.username });
        });
    }
  };

  const handleChange = (event) => {
    setFormData({ [event.target.name]: event.target.value });
  };

  async function editUsername() {
    await fetch(`${process.env.REACT_APP_API_URL}/profile/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error({ message: "Error updating username" });
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        setShowForm(false);
        getUsername();
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();
    editUsername();
  }

  function handleHamburger() {
    setHamburger(!hamburger);
  }

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <div>
      {hamburger ? (
        <Navbar style={{ paddingLeft: "10px" }} bg="primary" variant="dark">
          <Link to="/login">
            <Navbar.Brand>
              <img
                alt="logo"
                src="/logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
            </Navbar.Brand>
          </Link>
          <Nav className="mr-auto">
            {!localStorage.getItem("token") ? (
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  padding: "0px 5px",
                }}
                to="/login"
              >
                Login
              </Link>
            ) : (
              ""
            )}
            {!localStorage.getItem("token") ? (
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  padding: "0px 5px",
                }}
                to="/sign-up"
              >
                Register
              </Link>
            ) : (
              ""
            )}
            {/* <Link
          style={{ textDecoration: "none", color: "white", padding: "0px 5px" }}
          to="/about"
        >
          About
        </Link> */}
            {localStorage.getItem("token") ? (
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  padding: "0px 5px",
                }}
                to="/dashboard"
              >
                Dashboard
              </Link>
            ) : (
              ""
            )}
            {/* <Link
          style={{ textDecoration: "none", color: "white", padding: "0px 5px" }}
          to="/contact"
        >
          Contact
        </Link> */}
          </Nav>
          {localStorage.getItem("token") ? (
            <Nav>
              <NavDropdown title={user.name} id="basic-nav-dropdown">
                <div style={{ margin: "10px" }}>
                  <button
                    style={{ margin: "0px 10px 10px 0px" }}
                    onClick={() => {
                      setFormData({ name: user.name });
                      setShowForm(true);
                    }}
                  >
                    Edit Username
                  </button>
                  {showForm ? (
                    <form
                      style={{ marginBottom: "10px" }}
                      onSubmit={handleSubmit}
                    >
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <div className="modal-btn">
                        <button
                          style={{
                            backgroundColor: "#0d6efd",
                            color: "white",
                            border: "none",
                          }}
                          type="submit"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                          }}
                          onClick={() => {
                            setShowForm(false);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  ) : (
                    ""
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </NavDropdown>
            </Nav>
          ) : (
            ""
          )}
        </Navbar>
      ) : (
        ""
      )}
      {hamburger ? (
        <div
          onClick={handleHamburger}
          style={{
            textAlign: "center",
            border: "groove",
            cursor: "pointer",
          }}
        >
          <span className="drop-down-up">&gt;</span>
        </div>
      ) : (
        <div
          onClick={handleHamburger}
          style={{
            textAlign: "center",
            border: "groove",
            cursor: "pointer",
          }}
        >
          <span className="drop-down-down">&gt;</span>
        </div>
      )}
    </div>
  );
}
