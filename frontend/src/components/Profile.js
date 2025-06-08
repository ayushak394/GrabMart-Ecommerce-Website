import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import useTokenCheck from "../hooks/tokencheck";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../CSS/Profile.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaUsers,
} from "react-icons/fa";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

const baseURL = process.env.REACT_APP_API_URL;

const Profile = ({ totalItems }) => {
  useTokenCheck();

  const [file, setFile] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedBack] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState({
    type: "",
    text: "",
  });

  const userId = getUserIdFromToken();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setFeedbackMessage({
        type: "error",
        text: "Please select a file first",
      });
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await axios.post(
        `${baseURL}/Profile/uploadProfilePic/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProfilePic(response.data.profilePic);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const handleFeedbackChange = (event) => {
    setFeedBack(event.target.value);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      setFeedbackMessage({
        type: "error",
        text: "Please provide your feedback before submitting.",
      });
      return;
    }

    try {
      await axios.post(`${baseURL}/Profile/submitFeedback`, {
        feedback,
      });
      setFeedbackMessage({
        type: "success",
        text: "Feedback submitted successfully!",
      });
      setFeedBack("");
    } catch (error) {
      console.error("Error submitting feedback", error);
      setFeedbackMessage({
        type: "error",
        text: "Something went wrong while submitting feedback.",
      });
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchProfilePic = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/Profile/getProfilePic/${userId}`
        );
        setProfilePic(response.data.profilePic);
      } catch (error) {
        console.error("Error fetching profile picture: ", error);
      }
    };

    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/Profile/getUsername/${userId}`
        );
        setUserName(response.data.username);
      } catch (error) {
        console.error("Error fetching username: ", error);
      }
    };

    const fetchEmail = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/Profile/getEmail/${userId}`
        );
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching email: ", error);
      }
    };

    fetchProfilePic();
    fetchUsername();
    fetchEmail();
  }, [userId]);

  // Auto clear feedback message after 5 seconds
  useEffect(() => {
    if (feedbackMessage.text) {
      const timer = setTimeout(() => {
        setFeedbackMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage.text]);

  return (
    <div
      className="ProfilePage"
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      <Header showNavigationBar={false} totalItems={totalItems} />

      <div className="top-sections-container">
        <div className="profile-container">
          {profilePic && (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          )}
          <input
            type="file"
            accept=".jpg, .jpeg, .png, image/png, image/jpeg"
            onChange={handleFileChange}
          />
          <button onClick={handleUpload} className="uploadprofile">
            Update Profile Picture
          </button>
          {userName && (
            <h1 className="username">
              <b>Username:</b> {userName}
            </h1>
          )}
          {email && (
            <h1 className="email">
              <b>Email:</b> {email}
            </h1>
          )}
        </div>

        <div className="feedback-section">
          <h1>We would love to hear your feedback!</h1>
          <textarea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Tell us how we can improve your experience..."
          />
          {feedbackMessage.text && (
            <p
              className={`feedback-message ${
                feedbackMessage.text ? "visible" : "hidden"
              }`}
              style={{
                color: feedbackMessage.type === "success" ? "green" : "red",
              }}
            >
              {feedbackMessage.text}
            </p>
          )}
          <button onClick={handleSubmitFeedback}>Submit Feedback</button>
        </div>
      </div>

      <div className="contact-us-section">
        <h1>Contact Us</h1>
        <div className="map-and-contact">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019408968454!2d-122.4194151846819!3d37.77492977975927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c7d1e5f05%3A0x3792a360cbe1dd3d!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1688428232011!5m2!1sen!2sus"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: "10px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="contact-info">
            <p>
              <FaPhoneAlt /> <strong>Phone:</strong> +1 (555) 987-6543
            </p>
            <p>
              <FaEnvelope /> <strong>Email:</strong> support@grabmarts.com
            </p>
            <p>
              <FaMapMarkerAlt /> <strong>Address:</strong> 742 Grabmarts Plaza,
              Tech Valley Blvd, Silicon Heights, CA 90210
            </p>
            <p>
              <FaClock /> <strong>Office Hours:</strong> Mon-Sat, 9:00 AM - 7:00
              PM (PST)
            </p>

            <div
              className="social-media-links"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <FaUsers style={{ fontSize: "1.2rem" }} />
              <strong>Follow Us:</strong>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b5998", fontSize: "1.3rem" }}
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#E1306C", fontSize: "1.3rem" }}
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1DA1F2", fontSize: "1.3rem" }}
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0077B5", fontSize: "1.3rem" }}
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
