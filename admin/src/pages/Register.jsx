import React, { useState, useEffect } from "react";
import axios from "/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Register = () => {
  const navigate = useNavigate();
  const [name, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // Define errors state

  const handleBrandNameChange = (e) => {
    setBrandName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      console.log(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation errors:", error.response.data.errors);
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
      <div className="container">
        <br />
        <div className="row">
          <div className="col-9">
            <h2>Register</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="brandName">Name:</label>
            <input
              className="form-control"
              type="text"
              id="name"
              value={name}
              onChange={handleBrandNameChange}
            />
            {errors.name && (
              <div className="error" style={{ color: "red" }}>
                {errors.name[0]}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="brandName">Email:</label>
            <input
              className="form-control"
              type="text"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <div className="error" style={{ color: "red" }}>
                {errors.email[0]}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="brandName">Password:</label>
            <input
              className="form-control"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <div className="error" style={{ color: "red" }}>
                {errors.password[0]}
              </div>
            )}
          </div>

          <div>
            <br />
            <button type="submit" className="btn btn-primary w-100">
            Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
