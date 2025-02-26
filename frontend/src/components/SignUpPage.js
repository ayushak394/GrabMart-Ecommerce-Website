import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate(); // Initialize navigate function - Allows to navigate to different routes
  const [error, setError] = useState(""); // State to store any err meassage if generated during registration

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (would cause page to reload)
    setError("");
    const username = e.target.username.value; // Extract values entered by user into form fields
    const email = e.target.email.value;
    const password = e.target.password.value;

    const baseURL = "https://grabmart-backend.onrender.com";

    // Regex - Using pattern in email addresses to verify if email is valid or not
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be atleast 8 characters, and should contain one lower and uppercase letter, a number and a special character."
      );
      return;
    }

    if (username.length <= 5) {
      setError("Username must be longer than 5 characters.");
      return;
    }

    const body = {
      // creating object with user inputs, that will be sent in request to backend
      username,
      email,
      password,
    };

    try {
      // sending the post request to server
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST", // set http method to post
        headers: {
          "Content-Type": "application/json", // indicate type of data being sent
        },
        body: JSON.stringify(body), // convert data to JSON string to send in body of request
      });

      if (response.ok) {
        navigate("/Login"); // If response is OK redirect user to Login Page
      } else {
        const data = await response.json(); // Parse response as JSON to get error message
        setError(data.error); // Update error state with error message from server
      }
    } catch (error) {
      setError("Something went wrong"); // If error occurs generate a generic message
    }
  };

  return (
    <>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
      <div className="background">
        <div className="SignUpPage">
          <form onSubmit={handleSubmit}>
            <h1>SignUp</h1>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
              />
              <i class="bx bxs-user"></i>
            </div>

            <div className="input-box">
              <input type="email" name="email" placeholder="Email" required />
              <i class="bx bxs-envelope"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <i class="bx bxs-lock-alt"></i>
            </div>

            {error && <h2 className="error-message">{error}</h2>}

            <button type="submit" class="button">
              SignUp
            </button>
            <div className="register-link">
              <p>
                Already have an account? <Link to="/Login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
