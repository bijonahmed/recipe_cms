// src/pages/Home.js
import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "/config/axiosConfig";
import LeftSideBarComponent from "../components/LeftSideBarComponent";
import { LanguageContext } from "../context/LanguageContext";
const Signup = () => {
  const { content } = useContext(LanguageContext);
  // State to manage password visibility for both password fields
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsernamePassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState('');
  const [inviteCode, setInviteCode] = useState("");
  const [errors, setErrors] = useState({}); // Define errors state
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = (setVisible) => {
    setVisible((prevVisible) => !prevVisible);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlInviteCodeChange = (e) => {
    setInviteCode(e.target.value);
  };

  const handlRetypePasswordChange = (e) => {
    setRetypePassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsernamePassword(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/userRegister", {
        name,
        email,
        password,
        inviteCode,
        username,
        password_confirmation: retypePassword,
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
    <>
      <Helmet>
        {" "}
        <title> Signup</title>
      </Helmet>

      <GuestNavbar />
      <div className="main_content">
        <LeftSideBarComponent />
        <div className="main_section">
          {/* banner section start here  */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="login_section w-100">
                  <form className="login_form mx-auto" onSubmit={handleSubmit}>
                    <Link to="/"><img src="/images/LOGO.png" className="img-fluid login_logo" /></Link>
                    <div className="form-group mb-2">
                      <label>{content.lvl_sing_up_name || "Name"}</label>
                      <input type="text" placeholder="Jons" className="form-control" value={name} onChange={handleNameChange} />
                      {errors.name && (
                        <div className="error" style={{ color: "red" }}>
                          {errors.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-2">
                      <label>{content.lvl_sing_up_email || "Email"} </label>
                      <input type="email" placeholder="example@mail.com" className="form-control" value={email} onChange={handleEmailChange} />
                      {errors.email && (
                        <div className="error" style={{ color: "red" }}>
                          {errors.email[0]}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-2">
                      <label>{content.lvl_sing_up_username || "Username"} </label>
                      <input type="text" placeholder="username" className="form-control" value={username} onChange={handleUsernameChange} />
                      {errors.username && (
                        <div className="error" style={{ color: "red" }}>
                          {errors.username[0]}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-2">
                      <label>{content.lvl_sing_up_password || "Password"} </label>
                      <div className="input_group_pass">
                        <input
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="******"
                          className="form-control" value={password}
                          onChange={handlePasswordChange}
                        />
                        <i
                          className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                          onClick={() => togglePasswordVisibility(setPasswordVisible)}
                          style={{ cursor: 'pointer' }}
                        />
                        {errors.password && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.password[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group mb-2">
                      <label>{content.lvl_sing_up_repassword || "Retype Password"} </label>
                      <div className="input_group_pass">
                        <input
                          type={retypePasswordVisible ? 'text' : 'password'}
                          placeholder="******"
                          className="form-control" value={retypePassword} onChange={handlRetypePasswordChange}
                        />
                        <i
                          className={`fa-solid ${retypePasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}
                          onClick={() => togglePasswordVisibility(setRetypePasswordVisible)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>{content.lvl_ref_code_op || "Referal code (Optional)"} </label>
                      <input type="text" placeholder="Refer code" className="form-control" value={inviteCode} onChange={handlInviteCodeChange} />
                    </div>
                    <button type="submit" className="btn btn_main w-100 mb-3">{content.level_sign_up || "Sign Up"}</button>
                    <p className="text-center">{content.lvl_alreadyhaveaccount || "Already have an account?"}<Link to="/login">{content.level_sign_in || "Sign In"}</Link></p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />

      </div>

    </>
  );
};

export default Signup;
