import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/SignUpPage.css";
import axios from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

// Clear error after 5 seconds
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }
}, [error]);

// Clear success message after 5 seconds
useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(timer);
  }
}, [successMessage]);


  const baseURL = "http://localhost:4000";

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (would cause page to reload)
    setError("");
    const username = e.target.username.value; // Extract values entered by user into form fields
    const email = e.target.email.value;
    const password = e.target.password.value;
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

  const sendOtp = async () => {
    if (!phoneNo) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsSendingOtp(true);

    try {
      const response = await axios.post(`${baseURL}/auth/send-otp`, {
        phone: phoneNo,
      });
      setSuccessMessage("OTP sent successfully!");
      console.log(response.data);
    } catch (error) {
      setError("Failed to send OTP");
      console.log(error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || !phoneNo) {
      setError("Please enter the OTP!");
      return;
    }
    try {
      const response = await axios.post(`${baseURL}/auth/verify-otp`, {
        phone: phoneNo,
        code: otp,
      });
      if (response.data.message === "Phone no verified") {
        setSuccessMessage("Phone number verified successfully!");
      } else {
        setError("Invalid OTP");
      }
    } catch (error) {
      setError("Failed to verify OTP");
      console.error(error);
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
            <div className="input-box">
              <input
                type="number"
                name="number"
                placeholder="Enter your Phone Number"
                required
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <i class="bx bxs-lock-alt"></i>
            </div>

            <button
              type="button"
              className="button"
              onClick={sendOtp}
              disabled={isSendingOtp}
            >
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>

            <div className="input-box">
              <input
                type="number"
                name="number"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
              <i class="bx bxs-lock-alt"></i>
            </div>

            <button type="button" class="button" onClick={verifyOtp}>
              Verify OTP
            </button>

            {error && <h2 className="error-message">{error}</h2>}
            {successMessage && (
              <h2 className="success-message">{successMessage}</h2>
            )}

            <button type="submit" class="registerbutton">
              Register
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
