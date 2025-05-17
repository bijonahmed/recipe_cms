import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";

import { LanguageContext } from "../context/LanguageContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { content } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { http, setToken } = AuthUser();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = JSON.parse(sessionStorage.getItem("token"));
    if (token) {
      sessionStorage.removeItem("token"); // Remove token
      sessionStorage.removeItem("user"); // Remove user
    }

    try {
      const response = await http.post("/auth/userLogin", {
        username,
        password,
      });
      setToken(response.data.user, response.data.access_token);
      navigate("/dashboard"); // Adjust the navigation path as needed
    } catch (error) {
      const fieldErrors = error.response?.data.errors || {};
      setErrors({
        general: fieldErrors.account
          ? fieldErrors.account[0]
          : "Invalid username or password.",
        ...fieldErrors,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="bg-white p-0">
        <Header />
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center mb-4">
                     <br/>
                      <p className="mb-0">Please log in to your account</p>
                      {errors.account && (
                        <div style={{ color: "red" }}>{errors.account[0]}</div>
                      )}
                    </div>
                    <form className="row g-3" onSubmit={handleSubmit}>
                      <div className="col-12">
                        <label
                          htmlFor="inputEmailAddress"
                          className="form-label"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputEmailAddress"
                          placeholder="Username"
                          value={username}
                          onChange={handleUsernameChange}
                        />
                        {errors.username && (
                          <div style={{ color: "red" }}>
                            {errors.username[0]}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label
                          htmlFor="inputChoosePassword"
                          className="form-label"
                        >
                          Password
                        </label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control border-end-0"
                            id="inputChoosePassword"
                            placeholder="Enter Password"
                            value={password}
                            onChange={handlePasswordChange}
                          />
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              togglePasswordVisibility();
                            }}
                            className="input-group-text bg-transparent"
                          >
                            <i
                              className={`bx ${
                                showPassword ? "bx-show" : "bx-hide"
                              }`}
                            />
                          </a>
                        </div>
                        {errors.password && (
                          <div style={{ color: "red" }}>
                            {errors.password[0]}
                          </div>
                        )}
                      </div>
                     
                      <div className="col-12">
                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                          >
                            {loading ? "Processing..." : "Sign in"}
                          </button>
                        </div>
                      </div>
                    </form>

                     <div className="text-center mt-3">
                                <p>Already have an account? <Link to="/register" className="text-primary">Sign Up</Link></p>
                              </div>
                              <div className="d-flex justify-content-center">
                        <Link
                          to="/"
                          className="btn btn-outline-primary d-flex align-items-center"
                        >
                          <i className="bx bx-arrow-back me-2"></i> Back to Home
                        </Link>
                      </div>



                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
