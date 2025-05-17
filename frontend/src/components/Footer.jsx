import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
const Footer = () => {
 
  const [name, setName] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const fetechGlobalData = async () => {
    try {
      const response = await axios.get(`/public/getGlobalData`);
      //console.log("Navbar API Response:", response.data); // Log the response
      setName(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const currentYear = new Date().getFullYear();
  useEffect(() => {
    fetechGlobalData();
  }, []);

  return (
    <>
      <footer className="footer bg-black text-white">
        <div className="footer-top border-bottom border-dark">
          <div className="container">
            <div className="row gx-md-4 gy-md-0 g-4">
              <div className="col-lg-6 col-12 border-end border-dark py-4">
                <div className="py-lg-5">
                  <h6 className="fw-bold pb-3 text-uppercase">Contact us</h6>
                  <div>
                    <div className="d-flex align-items-start gap-4 mb-4">
                      <i className="ri-map-pin-2-fill ri-2x text-secondary" />
                      <div>
                        <p className="mb-0 text-secondary-emphasis">
                          {name.address}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-4 mb-4">
                      <i className="ri-mail-fill ri-2x text-secondary" />
                      <div>
                        <p className="mb-0 text-secondary-emphasis">
                          {name.email}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-4 mb-0">
                      <i className="ri-phone-fill ri-2x text-secondary" />
                      <div>
                        <p className="mb-0 text-secondary-emphasis">
                          {name.whatsApp}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6 border-end border-dark py-4 ps-lg-5">
                <div className="py-lg-5">
                  <h6 className="fw-bold pb-3 text-uppercase">Useful Links</h6>
                  <ul className="list-unstyled d-grid gap-2 m-0">
                    <li>
                      <Link to="/" className="link-secondary">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/about" className="link-secondary">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link to="/recipes" className="link-secondary">
                        Recipes
                      </Link>
                    </li>
                    <li>
                      <Link to="/login" className="link-secondary">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="link-secondary">
                        Register
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="link-secondary">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-12 py-4 ps-lg-5">
                <div className="py-lg-5">
                  <h6 className="fw-bold pb-3 text-uppercase">
                    Download Our App
                  </h6>
                  <p className="text-secondary-emphasis">
                    Experience the best of our services right at your
                    fingertips. Stay connected, get real-time updates, and enjoy
                    a seamless experience—anytime, anywhere.
                  </p>

                  <div className="d-flex align-items-center gap-3 mt-4">
                    <a href="#">
                      <img
                        src="/img/andriod-store.png"
                        alt="android-store"
                        className="img-fluid store border border-opacity-10 border-white"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/img/app-store.png"
                        alt="app-store"
                        className="img-fluid store border border-opacity-10 border-white"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-end py-5 bg-black">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                <p className="text-center m-0 text-white-50">
                  <a href="#" className="text-white">
                    
                      © {currentYear} {name.name}. All rights reserved.
                   
                  </a>{" "}
                </p>
              </div>
              <div className="col-auto">
                <div className="d-flex aling-items-center gap-4">

                  
                  <a className="text-white" href={name.fblink} target="_blank" >
                    <i className="ri-facebook-circle-fill ri-lg" />
                  </a>
                    <a className="text-white" href={name.youtubelink} target="_blank">
                    <i className="ri-youtube-fill ri-lg" />
                  </a>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
