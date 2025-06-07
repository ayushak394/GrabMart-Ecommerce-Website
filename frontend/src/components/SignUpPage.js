import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/SignUpPage.css";
import emailjs from "@emailjs/browser";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [registeredsuccessfully, setRegisteredsuccessfully] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const baseURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const sendOtp = async () => {
    if (!email || !username) {
      setError("Enter username and a valid email first.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    setIsSendingOtp(true);

    const templateParams = {
      user_name: username,
      user_email: email,
      otp_code: otpCode,
      year: new Date().getFullYear(),
    };

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID_2,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      setSuccessMessage("OTP sent to your email.");
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = () => {
    if (!otp) {
      setError("Enter the OTP.");
    } else if (otp === generatedOtp) {
      setSuccessMessage("Email verified successfully.");
      setRegisteredsuccessfully(true);
    } else {
      setError("Invalid OTP. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character."
      );
      return;
    }

    if (username.length <= 5) {
      setError("Username must be longer than 5 characters.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        navigate("/Login");
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed.");
      }
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  return (
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="bx bxs-envelope"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button
            type="button"
            className="button"
            onClick={sendOtp}
            disabled={isSendingOtp}
          >
            {isSendingOtp ? "Sending..." : "Send OTP to Email"}
          </button>

          <div className="input-box">
            <input
              type="number"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button type="button" className="button" onClick={verifyOtp}>
            Verify OTP
          </button>

          {error && <h2 className="error-message">{error}</h2>}
          {successMessage && (
            <h2 className="success-message">{successMessage}</h2>
          )}

          {registeredsuccessfully && (
            <button type="submit" className="registerbutton">
              Register
            </button>
          )}

          <div className="register-link">
            <p>
              Already have an account? <Link to="/Login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
