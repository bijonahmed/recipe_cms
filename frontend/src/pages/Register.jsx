import React, { useState } from "react";
import axios from "/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleBrandNameChange = (e) => setBrandName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value); // <-- Added

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side confirm password check
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match."] });
      return;
    }

    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        username
      });
      console.log(response.data.message);
      navigate("/login");

      Swal.fire({
        icon: "success",
        title: "Registration successfully!",
        timer: 3000,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error adding brand:", error);
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="bg-light p-0">
        <Header />
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
        >
          <div
            className="container col-md-6 col-lg-4"
            style={{ marginTop: "-100px" }}
          >
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row mt-3">
                  <div className="col-12 text-center">
                    <h2 className="fw-bold mb-3">Create an Account</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="name"
                      value={name}
                      onChange={handleBrandNameChange}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <div className="mt-2" style={{ color: "red" }}>
                        {errors.name[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      className="form-control"
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="mt-2" style={{ color: "red" }}>
                        {errors.email[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Username:
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <div className="mt-2" style={{ color: "red" }}>
                        {errors.username[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      className="form-control"
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Create a password"
                    />
                    {errors.password && (
                      <div className="mt-2" style={{ color: "red" }}>
                        {errors.password[0]}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password:
                    </label>
                    <input
                      className="form-control"
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <div className="mt-2" style={{ color: "red" }}>
                        {errors.confirmPassword[0]}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="btn btn-primary w-100">
                      Register
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary">
                      Sign In
                    </Link>
                  </p>
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

export default Register;
