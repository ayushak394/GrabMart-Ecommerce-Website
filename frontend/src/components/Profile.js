import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import useTokenCheck from "../hooks/tokencheck";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../CSS/Profile.css";

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

  const userId = getUserIdFromToken();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
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
    if (!feedback) {
      alert("Please provide your feedback before submitting");
      return;
    }

    try {
      await axios.post(`${baseURL}/Profile/submitFeedback`, {
        feedback,
      });
      alert("Feedback Submitted Successfully!");
      setFeedBack("");
    } catch (error) {
      console.error("Error submitting feedback", error);
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

  return (
    <div
      className="ProfilePage"
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      <Header showNavigationBar={false} totalItems={totalItems} />
      <div className="profile-container">
        {profilePic && (
          <img
            src={`${baseURL}${profilePic}`}
            alt="Profile"
            className="profile-pic"
          />
        )}
        <input
          type="file"
          accept=".jpg, .jpeg, .png, image/png, image/jpeg"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload} className="uploadprofile">
          Update Profile Picture
        </button>
        {userName && <h1 className="username">Your Username: {userName}</h1>}
        {email && <h1 className="email">Your Email: {email}</h1>}
      </div>

      <div className="feedback-section">
        <h1>We would love to hear your feedback!</h1>
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Leave your feedback here..."
        />
        <button onClick={handleSubmitFeedback}>Submit Feedback</button>
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
            <div>
              <strong>Phone:</strong> +1 234 567 890
            </div>
            <div>
              <strong>Email:</strong> contact@example.com
            </div>
            <div>
              <strong>Address:</strong> 123 Main Street, San Francisco, CA
            </div>
            <div>
              <strong>Office Hours:</strong> Mon-Fri, 9am - 6pm
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
