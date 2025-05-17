import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";
import AuthUser from "../../components/AuthUser";

const AddNewBooking = () => {
  const baseURL = axios.defaults.baseURL;
  const [errors, setErrors] = useState({});
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guestloading, setGuestLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { getToken, token, logout, http, setToken } = AuthUser();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setGuestLoading(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  const navigate = useNavigate(); // Make sure this is here

  const fetechActiveRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/public/activeRooms`);
      //console.log("API Response:", response.data); // Log the response
      setRoomData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetechActiveRooms();
  }, []);

  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkin: "",
    checkout: "",
    paymenttype: "",
    adult: 0,
    child: 0,
    room_id: "",
    phone: "",
    message: "",
    account_type: "Guest",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });
  };
  //Make Guest Account

  // Handle form submission guest account
  const guestHandleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset any previous errors

    try {
      // Convert to FormData (for multipart/form-data)
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(
        "/booking/adminBookingRequest",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`, // make sure `token` is defined
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Success toast
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).fire({
        icon: "success",
        title: "Successfully booked.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        checkin: "",
        room_id: "",
        checkout: "",
        paymenttype: "",
        adult: 0,
        child: 0,
        slug: "", // reset slug too
        message: "",
        account_type: "",
      });

      navigate("/booking/booking-list");
    } catch (error) {
      if (error.response?.status === 422) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
        setErrors(error.response.data.errors);
      } else if (error.response?.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Booking Conflict",
          text: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Unexpected Error",
          text: error.message,
        });
      }
    }
  };

  const handleAddNewClick = () => {
    navigate("/booking/booking-list");
  };

  useEffect(() => {}, []);

  return (
    <>
      <Helmet>
        <title>Add New Booking</title>
      </Helmet>

      <div>
        <div className="wrapper">
          <LeftSideBarComponent />
          <header>
            <GuestNavbar />
          </header>

          <div className="page-wrapper">
            <div className="page-content">
              <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Add New Booking</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item">
                        <Link to="/dashboard">
                          <i className="bx bx-home-alt" />
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Add New
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="ms-auto">
                  <button
                    type="button"
                    className="btn btn-black"
                    onClick={handleAddNewClick}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="card radius-10">
                {/* Start */}
                <div className="card-body p-4">
                  {/* Guest Account Form */}
                  <form onSubmit={guestHandleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                          {errors.name && (
                            <div style={{ color: "red" }}>{errors.name[0]}</div>
                          )}
                          <label htmlFor="name">Your Name</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && (
                            <div style={{ color: "red" }}>
                              {errors.email[0]}
                            </div>
                          )}
                          <label htmlFor="email">Your Email</label>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-floating">
                          <input
                            type="phone"
                            className="form-control"
                            id="phone"
                            placeholder="Your Phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                          {errors.phone && (
                            <div style={{ color: "red" }}>
                              {errors.phone[0]}
                            </div>
                          )}
                          <label htmlFor="phone">Your Phone</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="date"
                            className="form-control"
                            id="checkin"
                            value={formData.checkin}
                            min={new Date().toISOString().split("T")[0]} // this sets today's date as minimum
                            onChange={handleChange}
                          />
                          {errors.checkin && (
                            <div style={{ color: "red" }}>
                              {errors.checkin[0]}
                            </div>
                          )}
                          <label htmlFor="checkin">Check In</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="date"
                            className="form-control"
                            id="checkout"
                            value={formData.checkout}
                            min={new Date().toISOString().split("T")[0]} // this sets today's date as minimum
                            onChange={handleChange}
                          />
                          {errors.checkout && (
                            <div style={{ color: "red" }}>
                              {errors.checkout[0]}
                            </div>
                          )}
                          <label htmlFor="checkout">Check Out</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="adult"
                            value={formData.adult}
                            onChange={handleChange}
                          >
                            <option value={0}>No Adult</option>
                            <option value={1}>1 Adult</option>
                            <option value={2}>2 Adults</option>
                            <option value={3}>3 Adults</option>
                            <option value={4}>4 Adults</option>
                            <option value={5}>5 Adults</option>
                            <option value={6}>6 Adults</option>
                            <option value={7}>7 Adults</option>
                            <option value={8}>8 Adults</option>
                            <option value={9}>9 Adults</option>
                            <option value={10}>10 Adults</option>
                          </select>
                          <label htmlFor="adult">Adults</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="child"
                            value={formData.child}
                            onChange={handleChange}
                          >
                            <option value={0}>No Child</option>
                            <option value={1}>1 Child</option>
                            <option value={2}>2 Children</option>
                            <option value={3}>3 Children</option>
                            <option value={4}>4 Children</option>
                            <option value={5}>5 Children</option>
                            <option value={6}>6 Children</option>
                            <option value={7}>7 Children</option>
                            <option value={8}>8 Children</option>
                            <option value={9}>9 Children</option>
                            <option value={10}>10 Children</option>
                          </select>
                          <label htmlFor="child">Children</label>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="room_id"
                            value={formData.room_id}
                            onChange={handleChange}
                          >
                            <option value={0}>Please select</option>
                            {roomData.map((item, index) => (
                              <option key={index} value={item.room_id}>
                                {item.name}
                              </option>
                            ))}
                          </select>

                          <label htmlFor="room_id">Select Room</label>
                          {errors.room_id && (
                            <div style={{ color: "red" }}>
                              {errors.room_id[0]}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="paymenttype"
                            value={formData.paymenttype}
                            onChange={handleChange}
                          >
                            <option value={0}>Please select</option>
                            <option value={1}>Online Payment</option>
                            <option value={2}>Offline Payment</option>
                          </select>

                          <label htmlFor="paymenttype">Payment Type</label>
                          {errors.paymenttype && (
                            <div style={{ color: "red" }}>
                              {errors.paymenttype[0]}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            placeholder="Special Request"
                            id="message"
                            value={formData.message}
                            onChange={handleChange}
                            style={{ height: 100 }}
                          ></textarea>
                          <label htmlFor="message">Special Request</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <button
                          className="btn btn-primary w-100 py-3 shadow"
                          type="submit"
                          disabled={guestloading}
                        >
                          {guestloading ? (
                            <span>
                              Loading... {countdown > 0 && `${countdown}`}
                            </span>
                          ) : (
                            "Book Now"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* END */}
              </div>
            </div>
          </div>

          <div className="overlay toggle-icon" />
          <Link to="#" className="back-to-top">
            <i className="bx bxs-up-arrow-alt" />
          </Link>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AddNewBooking;
