import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";

import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
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
    sessionStorage.removeItem('token');  // Remove token
    sessionStorage.removeItem('user');   // Remove user
  }


    try {
      const response = await http.post("/auth/userLogin", { username, password });
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
      <div className="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
        <div className="container-fluid">
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
            <div className="col mx-auto">
              <div className="card mb-0">
                <div className="card-body">
                  <div className="p-4">
                    <div className="mb-3 text-center">
                      <img src="/assets/images/logo-icon.png" width={60} />
                    </div>
                    <div className="text-center mb-4">
                      <h5>MOON NEST Admin</h5>
                      <p className="mb-0">Please log in to your account</p>
                      <center>{errors.account && <div style={{ color: 'red' }}>{errors.account[0]}</div>}</center>
                    </div>
                    <div className="form-body">
                      <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-12">
                          <label htmlFor="inputEmailAddress" className="form-label">Username</label>
                          <input type="text" className="form-control" id="inputEmailAddress" placeholder="jhon" value={username} onChange={handleUsernameChange} />
                          {errors.username && (<div style={{ color: "red" }}>{errors.username[0]}</div>)}
                        </div>
                        <div className="col-12">
                          <label htmlFor="inputChoosePassword" className="form-label">Password</label>
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
                                e.preventDefault(); // Prevent default link behavior
                                togglePasswordVisibility();
                              }}
                              className="input-group-text bg-transparent"
                            >
                              <i className={`bx ${showPassword ? "bx-show" : "bx-hide"}`} />
                            </a>
                          </div>
                          {errors.password && (
                            <div className="error" style={{ color: "red" }}>
                              {errors.password[0]}
                            </div>
                          )}
                        </div>
                        <br/>
                        <div className="col-md-6 d-none">
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" />
                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Remember Me</label>
                          </div>
                        </div>
                        {/* <div className="col-md-6 text-end">	<a href="authentication-forgot-password.html">Forgot Password ?</a>
                      </div> */}
                        <div className="col-12">
                          <div className="d-grid">
                            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Processing..." : "Sign in"}</button>
                          </div>
                          
                        </div>

                      </form>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>

          {/*end row*/}
        </div>
      </div>

    </div>

  );
};

export default Login;
