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
    // when user selects an image to upload
    setFile(event.target.files[0]); // selected file is set to file state using the event object
  };

  const handleUpload = async () => {
    // to upload file to server
    if (!file) {
      // checks if file has been created or not
      alert("Please select a file first");
      return;
    }

    const formData = new FormData(); // if files is uploaded, creates an object to send file as a multipart data to the server
    formData.append("profilePic", file);

    try {
      const response = await axios.post(
        // to upload file to server
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
    const fetchProfilePic = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/Profile/getProfilePic/${userId}`
        );
        setProfilePic(response.data.profilePic);
      } catch (error) {
        console.error("Error fetching profile pictire: ", error);
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

    if (userId) {
      fetchProfilePic();
      fetchUsername();
      fetchEmail();
    }
  }, [userId]);

  return (
    <>
      <div className="ProfilePage">
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

        <Footer />
      </div>
    </>
  );
};

export default Profile;
