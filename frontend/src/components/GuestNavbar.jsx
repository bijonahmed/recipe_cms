// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import Footer from "../components/Footer";
import axios from "/config/axiosConfig";
import $ from "jquery";

const Navbar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { getToken, token, logout } = AuthUser();

  const fetechGlobalData = async () => {
    try {
      const response = await axios.get(`/public/getGlobalData`);
      // console.log("Navbar API Response:", response.data); // Log the response
      setName(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const logoutUser = async () => {
    if (token) {
      await logout();
      navigate("/login");
    }
  };

  useEffect(() => {
    fetechGlobalData();
  }, []);

  return (
    <>
      {/* header  */}
      <div className="bg-white tasty-nav shadow-sm">
        {/* Top-nav */}
        <nav className="top-nav">
          <div className="container py-3 py-lg-3">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto">
                <div className="position-relative d-flex align-items-center gap-2 site-brand">
                  <i className="ri-restaurant-line fs-2 lh-1 text-danger" />
                  <div className="lh-1">
                    <h5 className="fw-bold m-0 text-danger">{name.name}</h5>
                  </div>
                  <Link className="stretched-link" to="/" />
                </div>
              </div>
              <div className="col-auto d-flex align-items-center gap-3">
                {/* <a href="#" data-bs-toggle="modal" data-bs-target="#searchbar"><i class="ri-search-line ri-lg"></i></a> */}

                {token ? (
                  <>
                    <div className="dropdown d-none d-lg-block">
                      <Link
                        to="#"
                        className="dropdown-toggle d-flex align-items-center"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ri-account-circle-line ri-lg me-1" />
                        Profile
                      </Link>
                      <ul className="dropdown-menu">
                        <li>
                          <Link to="/user/profile" className="dropdown-item">
                            View Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/user/change-password"
                            className="dropdown-item"
                          >
                            Change Password
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="dropdown-item"
                            onClick={logoutUser}
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <a
                  href="#"
                  className="d-lg-none"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#sidenav"
                  aria-controls="sidenav"
                >
                  <i className="ri-menu-3-line ri-lg" />
                </a>

                {token ? (
                  <>
                    <Link
                      to="/submit-recipes"
                      className="btn btn-danger rounded-pill"
                    >
                      Submit Recipe
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-danger rounded-pill">
                      Submit Recipe
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        {/* bottom-nav */}
        <nav className="navbar osahan-main-nav bg-danger navbar-expand-lg bottom-nav d-none d-lg-block p-0">
          <div className="container">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav text-uppercase gap-4">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    <i className="ri-apps-2-line" /> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/recipes">
                    Recipes
                  </Link>
                </li>

                {token ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/user/change-password">
                        Change Password
                      </Link>
                    </li>

                    <li className="nav-item">
                      <a className="nav-link" href="#" onClick={logoutUser}>
                        Logout
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/register">
                        Register
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/contact">
                        Contact
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              <div className="d-flex align-items-center ms-auto gap-4">
                <a href={name.fblink} target="_blank" rel="noopener noreferrer">
                  <i className="ri-facebook-circle-fill ri-lg text-white" />
                </a>
                <a
                  href={name.youtubelink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-youtube-fill ri-lg text-white" />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* ------------- Header end ----------------  */}
      {/* Navbar offcanvas */}
      <div
        className="offcanvas offcanvas-top bg-opacity-75 h-100"
        tabIndex={-1}
        id="sidenav"
        aria-labelledby="sidenavLabel"
      >
        <div className="offcanvas-header d-flex justify-content-between">
          <div className="position-relative d-flex align-items-center gap-2 site-brand">
            <i className="ri-restaurant-line fs-2 lh-1" />
            <div className="lh-1">
              <h5 className="fw-bold m-0">{name.name}</h5>
            </div>
            <Link className="stretched-link" to="/" />
            <Link />
          </div>
          <a
            href="#"
            className="text-dark"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="ri-close-fill ri-2x" />
          </a>
        </div>
        <div className="offcanvas-body text-center">
          <div className="sidebar-nav">
            <ul className="navbar-nav mb-3">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  <i className="ri-apps-2-line" /> Home
                </Link>
              </li>

              {token ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/user/change-password">
                      Change Password
                    </Link>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#" onClick={logoutUser}>
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/contact">
                      Contact
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/recipes">
                  Recipes
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <a href={name.fblink} target="_blank" rel="noopener noreferrer">
                <i className="ri-facebook-circle-fill ri-lg" />
              </a>
              <a
                href={name.youtubelink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ri-youtube-fill ri-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
