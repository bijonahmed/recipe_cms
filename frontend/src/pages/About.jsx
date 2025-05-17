import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import { Helmet } from "react-helmet";

const About = () => {
  const [name, setName] = useState({});

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

  return (
    <div>
      <Helmet>
        <title>About</title>
      </Helmet>
      <Header />

      {/* Start */}
      <div>
        <div className="bg-white">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 col-md-10 col-12">
                <div className="text-center">
                  <h1 className="fw-bold pb-2 display-1 text-black">
                    About Us
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* our story */}
        <div className="py-2">
          <div className="container">
            <div
              className="row align-items-center g-5 g-md-5"
              style={{ marginBottom: "10px" }}
            >
              <div className="col-lg-12 col-12">
                <h6 className="text-danger">OUR STORY</h6>

              <p
  style={{ textAlign: "justify" }}
  className="lead"
  dangerouslySetInnerHTML={{
    __html: name?.about_us
      ? name.about_us
          .split('\n')
          .map(line => line.trim())
          .join('<br />')
      : "",
  }}
></p>


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

export default About;
