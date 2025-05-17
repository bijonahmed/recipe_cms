// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";

import axios from "/config/axiosConfig";
import $ from "jquery";

const DownloadApp = () => {
  const [name, setName] = useState("");
  const fetechGlobalData = async () => {
    try {
      const response = await axios.get(`/public/getGlobalSettingdata`);
      //console.log("API Response:", response.data.banner_image); // Log the response
      setName(response.data.banner_image);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetechGlobalData();
  }, []);

  return (
    <>
      <div className="pt-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container pt-1">
          <div className="row align-items-center g-0 rounded-5 overflow-hidden bg-warning">
            <div className="col-lg-6 col-12">
              <img src={`${name}`} alt="android-store" className="img-fluid" />
            </div>
            <div className="col-lg-6 col-12 px-4">
              <div className="p-5">
                <h6 className="text-danger">BEST MOBILE APP</h6>
                <h1 className="fw-bold py-2 display-5 text-black">
                  Download Our App
                </h1>

                <div className="d-flex align-items-center mt-5 gap-3">
                  <a href="#">
                    <img
                      src="/img/andriod-store.png"
                      alt="android-store"
                      className="img-fluid store rounded-3"
                    />
                  </a>
                  <a href="#">
                    <img
                      src="/img/app-store.png"
                      alt="app-store"
                      className="img-fluid store rounded-3"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
        </div>
      </div>
    </>
  );
};

export default DownloadApp;
