import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../../components/Footer";
import Header from "../../components/GuestNavbar";
import AuthUser from "../../components/AuthUser";
import Swal from "sweetalert2";

const Booking = () => {
  // Handle form submission
  const navigate = useNavigate(); // already imported from 'react-router-dom'
  const backtohome = async () => {
    navigate("/");
  };

  return (
    <div>
      <div className="bg-white p-0">
        <Header />
        {/* Start */}
        {/* Page Header Start */}
        <div
          className="container-fluid page-header mb-5 p-0"
          style={{ backgroundImage: "url(/img/carousel-1.jpg)" }}
        >
          <div className="container-fluid page-header-inner py-5">
            <div className="container text-center pb-5">
              <h1 className="display-3 text-white mb-3 animated slideInDown">
                Successfully Booking
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center text-uppercase">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>

                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page">
                    Booking
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        {/* Page Header End */}
      
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full border-l-4 border-green-500">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-green-700">
                Thank you for your booking!
              </h2>
              <p className="text-gray-600">
              We've received your request and everything looks great. Our team is preparing everything for your upcoming stay.
              </p>
              <p className="text-sm text-gray-400">
                If you have any questions, feel free to contact our support team
                anytime.
              </p>
              <div className="pt-4">
                <button className="btn btn-primary" onClick={backtohome}>
                  Back to Home
                </button>
                <br/>
              </div>
              <br/>
            </div>
          </div>
        </div>
        <br/>

        <Footer />

        <a
          href="#"
          className="btn btn-lg btn-primary btn-lg-square back-to-top"
        >
          <i className="bi bi-arrow-up" />
        </a>
      </div>
    </div>
  );
};
export default Booking;
