import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";


import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";


const Forgetpassword = () => {

  return (

    <div>
      <Helmet>
        {" "}
        <title> Login</title>
      </Helmet>
      <div>
        <GuestNavbar />
        <div className="main_content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="login_section w-100">
                  <form action="" className="login_form mx-auto">
                    <a href="index.html"><img src="/images/LOGO.png" className="img-fluid login_logo" /></a>
                    <div className="form-group mb-3">
                      <label>Email</label>
                      <input type="email" required placeholder="Email address" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn_main w-100 mb-3">Send Link</button>
                    <p className="text-center"><Link to="/login">Login here.</Link></p>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Forgetpassword;
