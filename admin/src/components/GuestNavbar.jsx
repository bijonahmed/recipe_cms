// src/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";

import axios from "/config/axiosConfig";
import $ from 'jquery';


const Navbar = () => {

  const { getToken, token, logout } = AuthUser();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/public/parentChildCategory");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    //fetchData();

  }, []);

  useEffect(() => {
    $('.header-box__mobile-menu').on('click', function () {
      $('.header-content').toggleClass('show');
      console.log('Toggled menu visibility:', $('.header-content').hasClass('show'));
    });
  }, []);




  const logoutUser = async () => {
    if (token) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <>


      {/* header  */}
      <div className="header_main sticky-top z-1">
        <nav className="navbar navbar-expand-lg bg-body-tertiary ">
          <div className="container">
            <Link className="navbar-brand" to="/"><img src="/images/logo.png" className="img-fluid" /></Link>
            {/* =========== */}
            <div className="offcanvas offcanvas-start " data-bs-backdrop="static" tabIndex={-1} id="staticBackdrop" aria-labelledby="staticBackdropLabel">
              <div className="offcanvas-header text-end">
                <button type="button" className="btn_close ms-auto" data-bs-dismiss="offcanvas" aria-label="Close">
                  <i className="fa-solid fa-x" />
                </button>
              </div>
              <div className="offcanvas-body">
                <div className="d-flex aligh-items-center w-100  h-100 justify-content-between">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {token ? (
                      <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/dashboard">
                          My Dashboard
                        </Link>
                      </li>
                    ) : null}


                    <li className="nav-item">
                      <Link className="nav-link active" aria-current="page" to="/pdf/margepdf">Merge Pdf</Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link active" aria-current="page" to="/pdf/splitpdf">Spilt Pdf</Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link active" aria-current="page" to="/about">About us</Link>
                    </li>


                    <li className="nav-item">
                      <Link className="nav-link active" aria-current="page" to="/pricing">Pricing</Link>
                    </li>


                  </ul>
                  <div className="header-content__buttons d-none d-lg-flex">

                    {token ? (
                      <><Link className="header-content__buttons-item" id="bLogin1" to="/users/profile"><span className="header-content__buttons-item-text"><i className="fa fa-user" />&nbsp;Profile&nbsp;&nbsp;</span></Link>
                        <Link className="header-content__buttons-item" id="bLogin1" to="#" onClick={logoutUser}><span className="header-content__buttons-item-text"><i className="fa fa-sign-out" />&nbsp;Logout</span></Link></>) : (
                      <><Link className="header-content__buttons-item" id="bLogin2" to="/login"><span className="header-content__buttons-item-text">Log In</span>&nbsp;&nbsp;</Link>
                        <Link className="header-content__buttons-item" id="bSignup" to="/signup"><span className="header-content__buttons-item-text">Sign Up</span></Link></>
                    )}
                  </div>
                </div>
              </div>
              <div className="header-content__buttons d-flex d-lg-none ">
                {token ? (
                  <Link className="header-content__buttons-item" id="bLogin" to="#" onClick={logoutUser}><span className="header-content__buttons-item-text"><i className="fa fa-sign-out" />&nbsp;Logout</span></Link>) : (
                  <><Link className="header-content__buttons-item" id="bLogin" to="/login"><span className="header-content__buttons-item-text">Log In</span></Link>
                    <Link className="header-content__buttons-item" id="bSignup" to="/login"><span className="header-content__buttons-item-text">Sign Up</span></Link></>)}
              </div>
            </div>
            <button className="btn btn_menu navbar-toggler text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </nav>
      </div>
      {/* ------------- Header end ----------------  */}





    </>
  );
};

export default Navbar;
