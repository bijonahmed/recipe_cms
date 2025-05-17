// src/pages/Index.js
import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/GuestNavbar";
import AuthUser from "../../components/AuthUser";
import Swal from "sweetalert2";
import "../../components/css/Myprofile.css";

const ChangePassword = () => {
  const [old_password, setOldPasswordName] = useState("");
  const [new_password, setNewPasswordName] = useState("");
  const [new_password_confirmation, setConfirmPasswordName] = useState("");
  const [errors, setErrors] = useState({});
  const { getToken, token, logout } = AuthUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formData = new FormData();
      formData.append("old_password", old_password);
      formData.append("new_password", new_password);
      formData.append("new_password_confirmation", new_password_confirmation);
      const response = await axios.post("/auth/updatePassword", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
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
        title: "Has been successfully update",
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

  const handleOldPasswordChange = (e) => {
    setOldPasswordName(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPasswordName(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPasswordName(e.target.value);
  };

  useEffect(() => {}, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>Change Password</title>
      </Helmet>
      {/* Start */}
      <Header />
      <section className="profile-banner">
        <div className="container">
          <h1>Change Password</h1>
        </div>
      </section>

      {/* Profile Form */}
      <section className="profile-form-section">
        <div className="container">
          <div className="profile-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <label htmlFor="password">Password</label>
                <div className="input_group">
                  <input
                    type="password"
                    className="form-control"
                    onChange={handleOldPasswordChange}
                  />
                  {errors.old_password && (
                    <div className="error" style={{ color: "red" }}>
                      {errors.old_password[0]}{" "}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="confirmPassword">New Password</label>
                <div className="input_group">
                  <input
                    type="password"
                    className="form-control"
                    onChange={handleNewPasswordChange}
                  />
                  {errors.new_password && (
                    <div className="error" style={{ color: "red" }}>
                      {errors.new_password[0]}{" "}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group mb-2">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input_group">
                  <input
                    type="password"
                    className="form-control"
                    onChange={handleConfirmPasswordChange}
                  />
                  {errors.new_password_confirmation && (
                    <div className="error" style={{ color: "red" }}>
                      {errors.new_password_confirmation[0]}{" "}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-primary--login"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
      {/* END */}
    </div>
  );
};

export default ChangePassword;
