import React, { useState } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LeftSideBarComponent from "../components/LeftSideBarComponent";

import GameSlider from "../components/GameSlider";

const HosterProfile = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Hoster List</title>
            </Helmet>

            <GuestNavbar />
            <div className="main_content">
                <LeftSideBarComponent />

                <div className="main_section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-9">
                                <div className="live_player">
                                    <iframe width="100%" height src="https://www.youtube.com/embed/kgppJX0G--E?si=CPSDb-aBRanhEkAj" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                                </div>
                                <GameSlider />

                                {/* GameSlider Component */}
                                {/* <GameSlider /> */}

                                <div>
                                    <nav className="tab_buttons">
                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                            <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Bio</button>
                                            <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Images</button>
                                            <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Videos</button>
                                        </div>
                                    </nav>
                                    <div className="tab-content" id="nav-tabContent">
                                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab text-white">
                                            <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                Voluptatum rerum laborum delectus consequatur dicta autem odio eaque reprehenderit
                                                magni facilis.</p>
                                        </div>
                                        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab text-white my-3">
                                            <div className="main_hosterList">
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(1).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(2).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(3).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(4).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(5).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(6).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(7).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(3).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(4).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(3).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(4).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(3).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(4).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(3).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(4).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                                <div className="hoster_">
                                                    <a href="profile.html" className="home_hoster_link">
                                                        <img src="/images/models/model(3).png" alt="pic" className="img-fluid" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab text-white">
                                            {/* game list part start here  */}
                                            <section className="game_list_container my-3">
                                                <div className="game_list">
                                                    <div className="games_box game_page_link">
                                                        <a href="#" className="game_link">
                                                            <i className="fa-regular fa-circle-play play_btn" />
                                                            <h1><i className="fa-solid fa-user" />200</h1>
                                                            <img src="/images/games/games-logo-1.png" alt="pic" className="img-fluid" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>



                            </div>
                            {/* RightSideBarHoster Component */}
                            <div className="col-xxl-3 d-xxl-block d-none ">
                                <div className="right_sidebar">
                                    <a href="games.html">
                                        <div className="ads_section">
                                            <img
                                                src="/images/250x250_Google_ads_size.gif" alt="pic"
                                                className="ads_image img-fluid"
                                            />
                                        </div>
                                    </a>
                                    <a href="games.html">
                                        <div className="ads_section_two">
                                            <img src="/images/adsbannar.webp" alt="pic"
                                                className="ads_image img-fluid"
                                            />
                                        </div>
                                    </a>


                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default HosterProfile;
