import { useNavigate } from "react-router-dom";
import "../CSS/LoginPage.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const body = { username, password };

    const baseURL = "http://localhost:4000";

    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/Home");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
      <div className="background-container">
        <div className="LoginPage">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                name="username"
                required
              />
              <i class="bx bxs-user"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                name="password"
                required
              />
              <i class="bx bxs-lock-alt"></i>
            </div>

            {error && <h2 className="error-message">{error}</h2>}

            <div className="remember-forgot">
              <Link to="/ForgotPassword">Forgot password?</Link>
            </div>

            <button type="submit" class="button">
              Login
            </button>
            <div className="register-link">
              <p>
                Don't have an account? <Link to="/">Register Here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
