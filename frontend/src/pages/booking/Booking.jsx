import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../../components/Footer";
import Header from "../../components/GuestNavbar";
import AuthUser from "../../components/AuthUser";
import Swal from "sweetalert2";

const Booking = () => {
  const baseURL = axios.defaults.baseURL;
  const [errors, setErrors] = useState({});
  const [roomData, setRoomData] = useState([]);
  const [adult, setAdult] = useState("");
  const [child, setChild] = useState("");
  const [facilitiesData, setRoomParticular] = useState("");
  const [roomimages, setRoomImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guestloading, setGuestLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [facilData, setSelectedFacilitiesData] = useState([]);
  const { slug } = useParams();
  const { getToken, token, logout, http, setToken } = AuthUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordlChange = (e) => {
    setPassword(e.target.value);
  };

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

  const getRoomDetails = async () => {
    try {
      const response = await axios.get(`/public/getRoomDetails`, {
        params: { slug: slug }, // Send as query param
      });
      console.log("API Response:", response.data.roomParticular.id);
      setRoomImages(response.data.activeRoomImg);
      setRoomParticular(response.data.roomParticular);
      checkSelectedFacilities(response.data.roomParticular.id);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const checkSelectedFacilities = async (id) => {
    try {
      const response = await axios.get(`/public/checkselectedfacilities`, {
        params: { id: id }, // or simply { userId } using shorthand
      });
      const userData = response.data;
      setSelectedFacilitiesData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetechActiveRooms();
    getRoomDetails();

    // Update slug in formData when URL slug changes
    setFormData((prevData) => ({
      ...prevData,
      slug: slug,
    }));
  }, [slug]);

  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone:"",
    checkin: "",
    checkout: "",
    paymenttype:"",
    adult: 0,
    child: 0,
    slug: slug,
    message: "",
    account_type: "",
  });
  const imgStyle = {
    width: "100%",  // Makes the image take up the full width of its container
    height: "auto", // Maintains the aspect ratio
    display: "block", // Removes unwanted space below the image
  };
  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  useEffect(() => {
    const savedCheckIn = localStorage.getItem("checkIn");
    const savedCheckOut = localStorage.getItem("checkOut");
    const savedAdult = localStorage.getItem("adult");
    const savedChild = localStorage.getItem("child");
  
    // Update formData state if values exist in localStorage
    setFormData(prevState => ({
      ...prevState,
      checkin: savedCheckIn || prevState.checkin,
      checkout: savedCheckOut || prevState.checkout,
      adult: savedAdult ? parseInt(savedAdult, 10) : prevState.adult,
      child: savedChild ? parseInt(savedChild, 10) : prevState.child,
    }));
  }, []);
  
  //Make Guest Account
  const guestAccount = async (e = null) => {
    if (e) e.preventDefault(); // prevent default only if event is passed

    try {
      setGuestLoading(true); // Set loading to true when the request starts
      setCountdown(10); // Start 10-second countdown
      const domain = window.location.origin;
      console.log("Loaded from domain:", domain);
      const response = await axios.post(
        "/auth/guestRegister",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          slug: formData.slug,
          checkin: formData.checkin,
          checkout: formData.checkout,
          paymenttype: formData.paymenttype,
          domain: domain,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setToken(response.data.user, response.data.access_token);
      console.log("userData:" + response.data.user.id);
      await guestHandleSubmit(response.data.user.id);
      setGuestLoading(false);


    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Handle validation errors
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.status === 409) {
        // Handle booking conflict (room already booked)
        Swal.fire({
          icon: "warning",
          title: "Booking Conflict",
          text: error.response.data.message,
        });
        console.warn("Booking conflict:", error.response.data.message);
      }

      console.error("Error submitting form", error);
    }
  };

  // Handle form submission guest account
  const guestHandleSubmit = async (userid) => {
    console.log("guest User ID: " + userid);
    // ✅ Add user_id to formData before sending
    const updatedFormData = {
      ...formData,
      user_id: userid, // or guest_user_id, depending on your API structure
      slug: slug,
    };

    setErrors({}); // Clear previous errors
    try {
      const response = await axios.post("/public/bookingRequest",updatedFormData);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: "Successfully booked.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        checkin: "",
        checkout: "",
        paymenttype:"",
        adult: 0,
        child: 0,
        slug: "", // reset slug here if you want to clear it
        message: "",
      });
      navigate("/booking-success");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Handle validation errors
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.status === 409) {
        // Handle booking conflict (room already booked)
        Swal.fire({
          icon: "warning",
          title: "Booking Conflict",
          text: error.response.data.message,
        });
        console.warn("Booking conflict:", error.response.data.message);
      }
    }
  };
  // Handle form submission register account
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default only if event is passed
    setErrors({}); // Clear previous errors
    try {
      const response = await axios.post("/booking/bookingRequest", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: "Successfully booked.",
      });
      setFormData({
        name: "",
        email: "",
        checkin: "",
        checkout: "",
        adult: 0,
        child: 0,
        slug: "", // reset slug here if you want to clear it
        message: "",
      });

      navigate("/booking-success");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Handle validation errors
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.status === 409) {
        // Handle booking conflict (room already booked)
        Swal.fire({
          icon: "warning",
          title: "Booking Conflict",
          text: error.response.data.message,
        });
        console.warn("Booking conflict:", error.response.data.message);
      }
    }
  };

  //For Login
  const loginBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await http.post("/auth/userLogin", {
        username,
        password,
      });
      if (response && response.status === 200) {
        setToken(response.data.user, response.data.access_token);
        openModalClose();
        window.location.href = `/booking-details/${slug}`;
      } else {
        setErrors({ general: "An unexpected error occurred." });
      }
    } catch (error) {
      const fieldErrors = error.response?.data.errors || {};
      setErrors({
        general: fieldErrors.account
          ? fieldErrors.account[0]
          : "Invalid username or password.",
        ...fieldErrors,
      });

      console.error("Login error:", error.response || error); // Optional: Log the error for debugging
    }
  };

  const loginbyModal = () => {
    if (!token) {
      openModalLogin(true); // Open the login modal if not logged in
    }
  };

  const modalRef = useRef(null);
  const openModalLogin = () => {
    const modalElement = new window.bootstrap.Modal(modalRef.current);
    modalElement.show(); // Opens the modal
  };

  const openModalClose = () => {
    const modalElement = window.bootstrap.Modal.getInstance(modalRef.current);
    if (modalElement) {
      modalElement.hide(); // This will close the modal
    }
  };

  return (
    <div>
      <div
        className="modal fade"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header justify-content-between">
              <h3 className="text-center mb-2 m-auto">Please login</h3>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={openModalClose}
                style={{ position: "absolute", top: "10px", right: "10px" }}
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={loginBooking} className="mx-auto mb-3">
                <center>
                  {errors.account && (
                    <div style={{ color: "red" }}>{errors.account[0]}</div>
                  )}
                </center>
                <div className="row">
                  <div className="col-md-12 m-auto">
                    <div className="py-4 px-2">
                      <div className="form-group mb-2">
                        <label>Username</label>
                        <input
                          type="text"
                          placeholder="Username"
                          className="form-control"
                          value={username}
                          onChange={handleUsernameChange}
                        />
                        {errors.username && (
                          <div style={{ color: "red" }}>
                            {errors.username[0]}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label>Password</label>
                        <div className="input_group_pass">
                          <input
                            type="password"
                            id="password"
                            placeholder="********"
                            className="form-control"
                            value={password}
                            onChange={handlePasswordlChange}
                          />
                          {errors.password && (
                            <div className="error" style={{ color: "red" }}>
                              {errors.password[0]}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-3 shadow"
                      >
                        Login
                      </button>
                      {/* Remove the bottom "Close" button if using only top-right icon */}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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
                {facilitiesData.name}
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center text-uppercase">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>

                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Booking
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        {/* Page Header End */}
      

        {/* Booking Start */}
        {loading ? (
          <div className="d-flex justify-content-center mt-3">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="container-xxl">
            <div className="container">
              {/* Section Heading */}
              <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h6 className="section-title text-uppercase text-primary fw-bold">
                  Room Booking
                </h6>
                <h1 className="mb-5">
                  Book A{" "}
                  <span className="text-primary text-uppercase fw-bold">
                    {facilitiesData.name}
                  </span>
                </h1>
              </div>

              {/* Room Image Carousel */}
              <div
                id="roomCarousel"
                className="carousel slide shadow-lg rounded"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {roomimages.map((image, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={index}
                    >
                      <img
                        src={image.roomImage}
                        className="d-block w-100 rounded-3"
                        alt="Room"
                        style={{
                          height: "500px",
                          objectFit: "cover",
                          filter: "brightness(90%)",
                        }}
                      />
                    </div>
                  ))}
                </div>
                {/* Carousel Controls */}
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#roomCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#roomCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>
              </div>

              {/* Booking Information & Form */}
              <div className="row g-5 mt-1">
                {/* Booking Preview */}
                <div className="col-lg-6">
                  <div className="p-4 rounded-3 shadow-sm">
                    <div className="booking-details">
                      {[
                        { label: "Room Type", value: facilitiesData.roomType },
                        { label: "Bed Type", value: facilitiesData.bed_name },
                        {
                          label: "Price",
                          value: `${facilitiesData.roomPrice} BDT / Night`,
                          isPrice: true,
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "14px 0",
                            borderBottom: "1px solid #eee",
                            fontFamily: "Segoe UI, sans-serif",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "15px",
                              color: "#555",
                              fontWeight: "500",
                            }}
                          >
                            {item.label}:
                          </span>
                          <span
                            style={{
                              fontSize: item.isPrice ? "20px" : "16px",
                              fontWeight: item.isPrice ? "700" : "600",
                              color: item.isPrice ? "#28a745" : "#333",
                            }}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <br />
                  <div style={{ textAlign: "justify" }}>
                    <strong>Room Description :</strong>{" "}
                    {facilitiesData.roomDescription}
                  </div>
                  <br />
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <tbody>
                        {facilData.length > 0 ? (
                          <>
                            {/* Display a heading row for Facilities */}
                            <tr>
                              <td colSpan="3">
                                <strong>Facilities:</strong>
                              </td>
                            </tr>

                            {facilData.reduce((acc, data, index, array) => {
                              const isFirstOccurrence =
                                index === 0 ||
                                data.facility_group_name !==
                                  array[index - 1].facility_group_name;

                              acc.push(
                                <tr key={data.id}>
                                  {/* Show Group Name only for the first row of each group */}
                                  {isFirstOccurrence ? (
                                    <td
                                      rowSpan={
                                        array.filter(
                                          (item) =>
                                            item.facility_group_name ===
                                            data.facility_group_name
                                        ).length
                                      }
                                    >
                                      <strong>
                                        {data.facility_group_name}
                                      </strong>
                                    </td>
                                  ) : null}

                                  <td>
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      <i className="fas fa-check-square text-primary"></i>
                                      {data.facilities_name}
                                    </span>
                                  </td>
                                </tr>
                              );

                              return acc;
                            }, [])}
                          </>
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">
                              No facilities found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Loader */}

                {/* END Loader */}

                {/* Booking Form */}
                <div className="col-lg-6">
                  <div className="p-4 bg-white rounded-3 shadow-lg">
                    <h5 className="mb-3 text-primary fw-bold">
                      Complete Your Booking
                    </h5>

                    {/* Start */}
                    <ul
                      className="nav nav-tabs mb-3"
                      id="accountTab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="general-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#general"
                          type="button"
                          role="tab"
                        >
                          Reguster Account
                        </button>
                      </li>
                                        {!token && (
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="guest-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#guest"
                        type="button"
                        role="tab"
                      >
                        Guest
                      </button>
                    </li>
                  )}


                    </ul>

                    <div className="tab-content" id="accountTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="general"
                        role="tabpanel"
                      >
                        {/* General Account Form */}
                        <form onSubmit={handleSubmit}>
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
                                  onFocus={() => {
                                    if (!token) loginbyModal();
                                  }}
                                />
                                {errors.name && (
                                  <div style={{ color: "red" }}>
                                    {errors.name[0]}
                                  </div>
                                )}
                                <label htmlFor="name">Your Name</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="email"
                                  placeholder="Your Email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  onFocus={() => {
                                    if (!token) loginbyModal();
                                  }}
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
                                  type="text"
                                  className="form-control"
                                  id="phone"
                                  placeholder="Your Phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  onFocus={() => {
                                    if (!token) loginbyModal();
                                  }}
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
                                  onFocus={() => {
                                    if (!token) loginbyModal();
                                  }}
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
                                  onFocus={() => {
                                    if (!token) loginbyModal();
                                  }}
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
                                  <option value={11}>11 Adults</option>
                                  <option value={12}>12 Adults</option>
                                  <option value={13}>13 Adults</option>
                                  <option value={14}>14 Adults</option>
                                  <option value={15}>15 Adults</option>
                                  <option value={16}>16 Adults</option>
                                  <option value={17}>17 Adults</option>
                                  <option value={18}>18 Adults</option>

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
                                  <option value={11}>11 Children</option>
                                  <option value={12}>12 Children</option>
                                  <option value={13}>13 Children</option>
                                  <option value={14}>14 Children</option>
                                  <option value={15}>15 Children</option>
                                  <option value={16}>16 Children</option>
                                  <option value={17}>17 Children</option>
                                  <option value={18}>18 Children</option>

                                </select>
                                <label htmlFor="child">Children</label>
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

                            {token ? (
                              <>
                                <div className="col-12">
                                  <button
                                    className="btn btn-primary w-100 py-3 shadow"
                                    type="submit"
                                  >
                                    Book Now
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="col-12">
                                  <button
                                    className="btn btn-primary w-100 py-3 shadow"
                                    type="submit"
                                    onClick={loginbyModal}
                                  >
                                    Book Now
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </form>
                      </div>
                      <div className="tab-pane fade" id="guest" role="tabpanel">
                        {/* Guest Account Form */}
                        <form onSubmit={guestAccount}>
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
                                  <div style={{ color: "red" }}>
                                    {errors.name[0]}
                                  </div>
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
                                  type="text"
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
                            <span>Loading... {countdown > 0 && `${countdown}`}</span>
                          ) : (
                            "Book Now"
                          )}
                        </button>
                            </div>
                          </div>
                        </form>
                       
                      </div>
                    </div>

                   

                    {/* END */}
                  </div>
                                
                </div>
              </div>
            </div>

           
            <div className="container">
            <img src="/img/pay.png" style={imgStyle} alt="Payment Image" />
              </div>

            <br />
            <div className="container">
              <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h6 className="section-title text-center text-primary text-uppercase">
                  Our Rooms
                </h6>
                <h1 className="mb-5">
                  Explore Our{" "}
                  <span className="text-primary text-uppercase">Rooms</span>
                </h1>
              </div>
              <div className="row g-4">
                {roomData.map((room, index) => (
                  <div
                    key={index}
                    className="col-lg-4 col-md-6 wow fadeInUp"
                    data-wow-delay="0.6s"
                  >
                    <div className="room-item shadow rounded overflow-hidden">
                      <div className="position-relative">
                        <img
                          className="img-fluid"
                          src={room.roomImage || "/img/room-3.jpg"}
                          alt="Room Image"
                        />
                        <small className="position-absolute start-0 top-100 translate-middle-y bg-primary text-white rounded py-1 px-3 ms-4">
                          BDT.&nbsp;{room.roomPrice}/Night
                        </small>
                      </div>
                      <div className="p-4 mt-2">
                        <div className="d-flex justify-content-between mb-3">
                          <h5 className="mb-0">
                            {room.name || "Super Deluxe"}
                          </h5>
                          <div className="ps-2">
                            <small className="fa fa-star text-primary" />
                            <small className="fa fa-star text-primary" />
                            <small className="fa fa-star text-primary" />
                            <small className="fa fa-star text-primary" />
                            <small className="fa fa-star text-primary" />
                          </div>
                        </div>
                        <div className="d-flex mb-3">
                          <small className="border-end me-3 pe-3">
                            <i className="fa fa-bed text-primary me-2" />{" "}
                            {room.bed_name}
                          </small>
                          {/* <small className="border-end me-3 pe-3">
                                   <i className="fa fa-bath text-primary me-2" /> 2 Bath
                                 </small>
                                 <small>
                                   <i className="fa fa-wifi text-primary me-2" /> Wifi
                                 </small> */}
                        </div>
                        <p className="text-body mb-3">
                          {room.roomDescription || ""}
                        </p>
                        <div className="d-flex justify-content-between">
                          <Link
                            to={`/booking-details/${room.slug}`}
                            className="btn btn-sm btn-primary rounded py-2 px-4"
                          >
                            View Detail
                          </Link>
                          <Link
                            to={`/booking-details/${room.slug}`}
                            className="btn btn-sm btn-dark rounded py-2 px-4"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <br />
          </div>
        )}

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
