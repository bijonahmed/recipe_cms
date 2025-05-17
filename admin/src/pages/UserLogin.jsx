import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
import AuthUser from "../components/AuthUser";

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { http, setToken } = AuthUser();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordlChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await http.post("/auth/userLogin", { email, password });
      setToken(response.data.user, response.data.access_token);
      navigate("/premimum-packages"); // Adjust the navigation path as needed
    } catch (error) {
      if (error.response && error.response.data) {
        const { errors: fieldErrors } = error.response.data;
        setErrors({
          general: fieldErrors.account
            ? fieldErrors.account[0]
            : "Invalid username or password.",
          ...fieldErrors,
        });
      } else {
        setErrors({ general: "Invalid username or password." });
      }
    }
  };

  return (
    <>
      <Helmet
        onChangeClientState={(newState) => {
          const metaDescription = document.querySelector(
            'meta[name="description"]'
          );
          if (metaDescription) {
            metaDescription.setAttribute(
              "content",
              "Login description" || "Login description"
            );
          }
        }}>
        {" "}
        <title>User Login</title>
      </Helmet>

      <GuestNavbar />

      <div className="container">
        <div className="row">
          <div className="col-md-5 m-auto">
            <div className="login_sec register_sec">
              <h1>Log In to your account</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label>Email</label>
                        <input className="form-control"
                        type="email"
                        name="email"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange} />
                      {errors.email && (
                        <div style={{ color: "red" }}>
                          {errors.email[0]}
                        </div>
                      )}
                </div>
                <div className="form-group mb-2">
                  <label>Password</label>
                  <div className="input_group">
                       <input
                       className="form-control"
                        type="password"
                        name="password"
                        placeholder="**********"
                        id="password"
                        value={password}
                        onChange={handlePasswordlChange}
                      />
                      {/* Display password error if present */}
                      {errors.password && (
                        <div className="error" style={{ color: "red" }}>
                          {errors.password[0]}
                        </div>
                      )}
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <input type="checkbox" id="remember" className="me-2" />
                  <label>Remember me</label>
                </div>
                <button className="btn btn-primary btn-primary--login"> {" "} Log In{" "}
                </button>
                <a
                  data-v-67c2aaad
                  href="#"
                  className="forgot"
                  data-test="forgot-link"
                >
                  Forgot Your Password?
                </a>  
              </form>
              <div className="signup">
                <span>Don't have an account?</span>{" "}
                <Link to="/signup" className="register-link">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
