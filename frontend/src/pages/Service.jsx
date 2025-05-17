import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import { Helmet } from "react-helmet";

const Service = () => {
  const [name, setName] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);

  const fetchGlobalData = async () => {
    try {
      const response = await axios.get(`/public/getGlobalData`);
      setName(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/public/sendContact`, formData); // Laravel endpoint
      if (response.status === 200) {
        setShowModal(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Try again.");
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <Helmet>
        <title>Our Service</title>
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
                Service
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center text-uppercase">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">Pages</a>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Service
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

     
        {/* Start */}
        {/* Service Start */}
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h6 className="section-title text-center text-primary text-uppercase">
                Our Services
              </h6>
              <h1 className="mb-5">
                Explore Our{" "}
                <span className="text-primary text-uppercase">Services</span>
              </h1>
            </div>
            <div className="row g-4">
              <div
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <a className="service-item rounded" href="#">
                  <div className="service-icon bg-transparent border rounded p-1">
                    <div className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                      <i className="fas fa-mug-hot fa-2x text-primary" />
                    </div>
                  </div>
                  <h5 className="mb-3">Coffee Bar</h5>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <a className="service-item rounded" href="#">
                  <div className="service-icon bg-transparent border rounded p-1">
                    <div className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                      <i className="fas fa-utensils fa-2x text-primary" />
                    </div>
                  </div>
                  <h5 className="mb-3">Restaurant</h5>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <a className="service-item rounded" href="#">
                  <div className="service-icon bg-transparent border rounded p-1">
                    <div className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                      <i className="fas fa-concierge-bell fa-2x text-primary" />
                    </div>
                  </div>
                  <h5 className="mb-3">Room Service</h5>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.4s"
              >
                <a className="service-item rounded" href="#">
                  <div className="service-icon bg-transparent border rounded p-1">
                    <div className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                      <i className="fas fa-concierge-bell fa-2x text-primary" />
                    </div>
                  </div>
                  <h5 className="mb-3">24x7 Reception</h5>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <a className="service-item rounded" href="#">
                  <div className="service-icon bg-transparent border rounded p-1">
                    <div className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                      <i className="fas fa-car fa-2x text-primary" />
                    </div>
                  </div>
                  <h5 className="mb-3">Car Rental</h5>
                </a>
              </div>

              <div
                className="col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay="0.6s"
              >
                <a className="service-item rounded" href="#">
                  <div className="service-icon bg-transparent border rounded p-1">
                    <div className="w-100 h-100 border rounded d-flex align-items-center justify-content-center">
                      <i className="fas fa-wifi fa-2x text-primary" />
                    </div>
                  </div>
                  <h5 className="mb-3">Secure Wi-Fi</h5>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Service End */}

        {/* END */}

        {/* Footer */}
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

export default Service;
