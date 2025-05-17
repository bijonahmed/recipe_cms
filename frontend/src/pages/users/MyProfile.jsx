// src/pages/Index.js
import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/GuestNavbar";
import AuthUser from "../../components/AuthUser";
import "../../components/css/Myprofile.css";

import Swal from "sweetalert2";

const MyProfile = () => {
  const navigate = useNavigate();
  const { getToken, token, logout } = AuthUser();
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [username, setUsername] = useState("");
  const [rule_id, setRuleId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPassword] = useState("");
  const [roles, setRuleData] = useState([]);

  const fetchRuleData = async () => {
    try {
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(`/user/getRoles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.data) {
        setRuleData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Fetch user data from the API and update state user/getUserRow
  const defaultFetch = async () => {
    try {
      const response = await axios.get(`booking/getUserRow`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.data;
      console.log("API response data:", userData.name); // Debugging: Check API response

      // Update state with fetched user data
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setCompany(userData.company_name || "");
      setUsername(userData.username || "");
      setRuleId(userData.role_id || "");
      //setStatus(userData.status === 1 || userData.status === 0 ? userData.status : "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      //formData.append("id", user.id);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("company", company);
      formData.append("username", username);
      formData.append("rule_id", rule_id);
      formData.append("password", password);
      formData.append("status", 1);

      const response = await axios.post("/user/updateBookingUser", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Your data has been successfully saved.",
      });

      //console.log(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleConfigName = (e) => {
    setName(e.target.value);
  };
  const handleConfigEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleConfigPhone = (e) => {
    setPhone(e.target.value);
  };
  const handleConfigCompany = (e) => {
    setCompany(e.target.value);
  };
  const handleConfigUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleConfigRuleId = (e) => {
    setRuleId(e.target.value);
  };
  const handleConfigPassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    defaultFetch();
    fetchRuleData();
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title> My Profile</title>
      </Helmet>
      {/* Start */}
      <div className="profile-wrapper">
        <Header />

        {/* Page Banner */}
        <section className="profile-banner">
          <div className="container">
            <h1>My Profile</h1>
            <p>Update your personal information</p>
          </div>
        </section>

        {/* Profile Form */}
        <section className="profile-form-section">
          <div className="container">
            <div className="profile-card">
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter Name"
                    value={name}
                    onChange={handleConfigName}
                  />
                  {errors.name && (
                    <span className="error">{errors.name[0]}</span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={handleConfigEmail}
                  />
                  {errors.email && (
                    <span className="error">{errors.email[0]}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    placeholder="Enter Phone"
                    value={phone}
                    onChange={handleConfigPhone}
                  />
                  {errors.phone && (
                    <span className="error">{errors.phone[0]}</span>
                  )}
                </div>

                {/* Username */}
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter Username"
                    value={username}
                    onChange={handleConfigUsername}
                  />
                  {errors.username && (
                    <span className="error">{errors.username[0]}</span>
                  )}
                </div>

                {/* Submit */}
                <div className="form-actions">
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* END */}
    </div>
  );
};

export default MyProfile;
