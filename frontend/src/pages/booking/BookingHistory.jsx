// src/pages/Index.js
import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "/config/axiosConfig";
import GuestNavbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import Footer from "../../components/Footer";
import Header from "../../components/GuestNavbar";

import AuthUser from "../../components/AuthUser";
import "../../components/css/BookingInvoice.css";
import html2pdf from 'html2pdf.js';

const BookingHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // already imported from 'react-router-dom'
  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const [roomData, setRoomData] = useState([]);
  const { id } = useParams();
  const [facilData, setSelectedFacilitiesData] = useState([]);
  const [facilitiesData, setRoomParticular] = useState("");
  const [settingData, setSetting] = useState("");
  const [roomimages, setRoomImages] = useState([]);
  const generateTime = new Date().toLocaleString('en-GB', {
    weekday: 'short', // Short weekday (e.g., Mon, Tue)
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24-hour clock
  });
  const fetechActiveBookingRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/booking/activeBookingRooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const response = await axios.get(`/booking/getBookingDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // Send as query param
      });
      console.log("API Response:", response.data.roomParticular.id);
      setRoomImages(response.data.activeRoomImg);
      setRoomParticular(response.data.roomParticular);
      setSetting(response.data.setting);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };


  // Correctly closed useEffect hook
  useEffect(() => {
    getRoomDetails();
    fetechActiveBookingRooms();

  }, []);


  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [id]);


  const handleGeneratePDF = () => {
    const element = document.getElementById("makepdf");
    if (!element) return;
  
    const opt = {
      margin: 0.5,
      filename: `booking-summary.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
  
    // Delay to ensure DOM is fully rendered
    setTimeout(() => {
      html2pdf().set(opt).from(element).save();
    }, 300);
  };
  
  return (
    <div>
      <Helmet>
        <title>Booking History</title>
      </Helmet>
      {/* Start */}

      <div>
        <Helmet>
          <title>Booking History Details</title>
        </Helmet>
        <div className="bg-white p-0">
          <Header />
          {/* Page Header */}
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
                      <Link to="/dashboard">Dashbaord</Link>
                    </li>

                    <li
                      className="breadcrumb-item text-white active"
                      aria-current="page"
                    >
                      {facilitiesData.name}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>

          {/* start */}
          {/* Room Start */}
          <div className="container-xxl py-4">
  <div className="container">

    {/* Room Image Carousel */}
    <div
      id="roomCarousel"
      className="carousel slide mb-4 shadow rounded"
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
                height: "400px",
                objectFit: "cover",
                filter: "brightness(90%)",
              }}
            />
          </div>
        ))}
      </div>
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

    {/* Booking Summary Invoice Style */}


    <div className="col-lg-12" id="makepdf">
    <div >
    <center><h3>{settingData.name}</h3></center>
    <center>{settingData.address}</center>
    <center>{settingData.email}, {settingData.whatsApp}</center>
    <center><small>PDF Generate Time : {generateTime}</small></center>
    <br/>
    </div>
      <div
        style={{
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <h4 style={{ marginBottom: "20px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
          Booking Summary
        </h4>

        {[ 
          { label: "Room Name", value: facilitiesData.room_name },
          { label: "Bed Type", value: facilitiesData.bed_name },
          { label: "Check IN", value: facilitiesData.checkin },
          { label: "Check OUT", value: facilitiesData.checkout },
          { label: "Days", value: facilitiesData.total_booking_days },
          { label: "Price", value: `${facilitiesData.roomPrice} BDT / Night`, isPrice: true },
         // { label: "Total", value: `${facilitiesData.total_booking_days} x ${facilitiesData.roomPrice} BDT`, isPrice: true },
          {
            label: "Grand Total",
            value: `${facilitiesData.total_booking_days} x ${facilitiesData.roomPrice} = ${
              facilitiesData.total_booking_days * facilitiesData.roomPrice
            } BDT`,
            isPrice: true,
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px dashed #ddd",
            }}
          >
            <span style={{ fontWeight: "500", color: "#555" }}>{item.label}</span>
            <span style={{
              fontWeight: "600",
              color: item.isPrice ? "#28a745" : "#000",
              fontSize: item.isPrice ? "17px" : "15px",
            }}>
              {item.value}
            </span>
          </div>
        ))}

        <div style={{ marginTop: "25px" }}>
          <strong>Room Description:</strong>
          <p style={{ textAlign: "justify", marginTop: "8px", color: "#333" }}>
            {facilitiesData.roomDescription}
          </p>
        </div>
      </div>

      {/* Facilities Table */}
      
    </div>
    <div style={{ marginTop: "20px", textAlign: "center" }}>
    <div className="text-center mt-4">
  <button className="btn btn-success" onClick={handleGeneratePDF}>
    Download PDF
  </button>
</div>
</div>

  </div>
</div>

          <br />
          <br />
          {/* Room End */}

          {/* end */}
          <Footer />

          <a
            href="#"
            className="btn btn-lg btn-primary btn-lg-square back-to-top"
          >
            <i className="bi bi-arrow-up" />
          </a>
        </div>
      </div>

      {/* END */}
    </div>
  );
};

export default BookingHistory;
