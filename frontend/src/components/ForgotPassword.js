import React, { useState } from "react";
import "../CSS/ForgotPassword.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const newPassword = e.target.password.value;

    const baseURL = "https://grabmart-backend.onrender.com";

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "Password must be atleast 8 characters, and should contain one lower and uppercase letter, a number and a special character."
      );
      return;
    }
    try {
      const response = await fetch(`${baseURL}/auth/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Password Updated succesfully!");
      } else {
        const errorData = await response.json();
        setMessage(
          errorData.message ||
            "Failed to update password. Please check your email address"
        );
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  return (
    <>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />
      <div className="background-container">
        <div className="ForgotPasswordPage">
          <form onSubmit={handleSubmit}>
            <h1>Forgot Password</h1>

            <div className="input-box">
              <input type="text" name="email" placeholder="Email" required />
              <i class="bx bxs-user"></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder=" New Password"
                required
              />
              <i class="bx bxs-lock-alt"></i>
            </div>

            {message && <h2 className="error-message">{message}</h2>}

            <button type="submit" class="button">
              Update Password
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

export default ForgotPassword;
