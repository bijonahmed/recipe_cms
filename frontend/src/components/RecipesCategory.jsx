// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";

import axios from "/config/axiosConfig";
import $ from "jquery";

const RecipesCategory = () => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(localStorage.getItem("checkIn") || "");
  const [checkOut, setCheckOut] = useState(
    localStorage.getItem("checkOut") || ""
  );
  const [adult, setAdult] = useState(
    localStorage.getItem("adult") ? parseInt(localStorage.getItem("adult")) : 0
  );
  const [child, setChild] = useState(
    localStorage.getItem("child") ? parseInt(localStorage.getItem("child")) : 0
  );
  const [error, setError] = useState("");
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("checkIn", checkIn);
    localStorage.setItem("checkOut", checkOut);
    localStorage.setItem("adult", adult);
    localStorage.setItem("child", child);
  }, [checkIn, checkOut, adult, child]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!checkIn || !checkOut) {
      setError("Please select both Check In and Check Out dates.");
      return;
    }

    const formData = {
      check_in: checkIn,
      check_out: checkOut,
      adult,
      child,
    };

    try {
      setLoading(true);
      const response = await axios.post("/public/filterBooking", formData);
      //console.log("Booking success:", response.data);
      setRoomData(response.data.rooms);
      // Save values to local storage
      localStorage.setItem("checkIn", checkIn);
      localStorage.setItem("checkOut", checkOut);
      localStorage.setItem("adult", adult);
      localStorage.setItem("child", child);

      // Optional: Show success message or redirect
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div className="bg-white py-5">
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-xl-7 col-lg-8 col-md-10 col-12">
              <div className="text-center">
                <h1 className="fw-bold pb-2 display-5 text-black">
                  Recipes By Category
                </h1>
                <p className="text-muted lead">
                  Fusce dignissim blandit justo, eget elementum risus tristique.
                  Nunc lacus lacus, sit amet accumsan est pulvinar non. Praesent
                  tristique enim lorem. Phasellus a auctor lacus.
                </p>
              </div>
            </div>
          </div>
          <div className="row g-5">
            <div className="col-lg-3 col-md-6 col-12">
              <div
                className="card bg-white border-0 rounded-5 overflow-hidden">
                <img
                  src="/img/category/sweet.jpg"
                  className="card-img"
                  alt="sweet"
                />
                <div className="card-img-overlay d-flex align-items-end p-4">
                  <div>
                    <h5 className="bg-danger rounded-pill px-3 py-2 text-white">
                      Sweets
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div
                className="card bg-white border-0 rounded-5 overflow-hidden">
                <img
                  src="/img/category/burger.jpg"
                  className="card-img"
                  alt="burger"
                />
                <div className="card-img-overlay d-flex align-items-end p-4">
                  <div>
                    <h5 className="bg-danger rounded-pill px-3 py-2 text-white">
                      Burger
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div
                className="card bg-white border-0 rounded-5 overflow-hidden">
                <img
                  src="/img/category/drinks.jpg"
                  className="card-img"
                  alt="drinks"
                />
                <div className="card-img-overlay d-flex align-items-end p-4">
                  <div>
                    <h5 className="bg-danger rounded-pill px-3 py-2 text-white">
                      Drinks
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <div
                className="card bg-white border-0 rounded-5 overflow-hidden">
                <img
                  src="/img/category/pizza.jpg"
                  className="card-img"
                  alt="pizza"
                />
                <div className="card-img-overlay d-flex align-items-end p-4">
                  <div>
                    <h5 className="bg-danger rounded-pill px-3 py-2 text-white">
                      Pizza
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipesCategory;
