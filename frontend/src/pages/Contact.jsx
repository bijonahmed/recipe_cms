import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import { Helmet } from "react-helmet";

const Contact = () => {
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
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/public/sendContact`, formData);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Thank you for contacting us.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        Swal.fire("Oops", "Something went wrong!", "error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire("Error", "Submission failed. Try again.", "error");
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <Header />

      {/* Start */}
      <div>
        <div className="bg-white py-5">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 col-md-10 col-12">
                <div className="text-center">
                  <h1 className="fw-bold pb-2 display-1 text-black">
                    Contact Us
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* our story */}
        <div>
          {/* some contact information */}
          <div className="pb-5">
            <div className="container pb-5">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="bg-white rounded-5 text-center">
                    <i className="ri-map-pin-2-fill ri-3x text-danger" />
                    <div className="pt-3">
                      <h4 className="fw-bold">Physical Address​</h4>
                      <p className="text-muted mb-0">{name.address}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="bg-white rounded-5 text-center">
                    <i className="ri-send-plane-fill ri-3x text-danger" />
                    <div className="pt-3">
                      <h4 className="fw-bold">Email Address​</h4>
                      <p className="text-muted mb-0"> {name.email}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="bg-white rounded-5 text-center">
                    <i className="ri-phone-fill ri-3x text-danger" />
                    <div className="pt-3">
                      <h4 className="fw-bold">Phone Numbers​</h4>
                      <p className="text-muted mb-0">{name.whatsApp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* contact message */}
          <div className="py-5 bg-light">
            <div className="container py-5">
              <div className="row g-5 g-md-5 align-items-center">
                <div className="col-lg-12 col-12">
                  <div className="bg-white rounded-5 shadow p-5">
                    <div className="mb-5">
                      <h1 className="fw-bold">Get In Touch</h1>
                      <p className="text-muted">
                        Nullam condimentum leo id elit sagittis auctor.
                      </p>
                    </div>
                    <form className="row g-4" onSubmit={handleSubmit}>
                      <div className="col-12">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="subject"
                          className="form-control"
                          placeholder="Enter your subject"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                      <textarea
  name="message"
  className="form-control"
  rows={6}
  placeholder="Enter your comment"
  value={formData.message}
  onChange={handleChange}
/>
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-danger btn-lg w-100"
                        >
                          Send Message
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* END */}

      <Footer />
    </div>
  );
};

export default Contact;
