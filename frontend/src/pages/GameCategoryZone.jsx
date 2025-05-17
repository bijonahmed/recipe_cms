import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


import Loader from "../components/Loader";

import axios from "/config/axiosConfig";

import LeftSideBarComponent from "../components/LeftSideBarComponent";
import { LanguageContext } from "../context/LanguageContext";

const GameCategoryZone = () => {

    const { language, content, changeLanguage } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [responseData, setData] = useState([]);
    const [gameTypeName, gtypeName] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { slug } = useParams();
    console.log("==Category Slug=" + slug);
    const defaultFetch = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/public/getAllGames', {
                params: {
                  slug: slug,
                  page: page,
                  language: language  // Add more parameters as needed
                }
              });
            setData(prevData => [...prevData, ...response.data.data]); // Append new data to existing data
            gtypeName(response.data.gameTypeName);
            setTotalPages(response.data.last_page); // Set total pages
            setCurrentPage(response.data.current_page); // Update current page
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        defaultFetch();
    }, [language,slug]); // Dependency array includes slug and currentPage



    // Handle "Load More" button click
    const loadMore = () => {
        if (currentPage < totalPages) {
            defaultFetch(currentPage + 1); // Fetch the next page
        }
    };


    const ImageWithFallback = ({ src, alt }) => {
        const [imageSrc, setImageSrc] = useState(src);

        const handleError = () => {
            setImageSrc('/images/model.png'); // Set the default image path
        };

        return (
            <img
                src={imageSrc}
                alt={alt}
                className="img-fluid"
                onError={handleError}
            />
        );
    };

    return (
        <>
            <Helmet>
                <title>Games List {slug}</title>
            </Helmet>

            <GuestNavbar />
            <div className="main_section">
                <LeftSideBarComponent />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-9">
                            <div className="banner_section">
                                <div className="swiper bannerSlider">
                                    {/* SliderComponent Component */}
                               
                                    <div className="swiper-pagination" />
                                </div>
                            </div>

                            {/* GameSlider Component */}
                            <div className="title_section">
                                <a href="#" onClick={() => navigate(-1)}>
                                    <i className="fa-solid fa-chevron-left" />
                                </a>
                                <h1 className="page_title">{gameTypeName} </h1>
                            </div>
                            {loading ? ( // Conditional rendering based on loading state
                                <center>
                                    <Loader />
                                    <div className="loading-indicator">
                                        <img src="/images/loader.gif" />
                                        <span className="text-black">Loading.....</span>
                                    </div>
                                </center>
                                // <div className="loading">Loading...</div>
                            ) : (
                                <div className="game_list_2">
                                    {responseData.map((game, index) => (
                                        <div className="game_box" key={index}>
                                            <Link to={`/play-game/${game.game_code.toLowerCase()}`} className="home_hoster_link">
                                                <ImageWithFallback src={game.imagepath} className="img-fluid" />
                                                <h5><center>{game.translate_name}</center></h5>
                                            </Link>
                                        </div>
                                    ))}

                                </div>

                            )}

                            <center>  {!loading && currentPage < totalPages && (
                                <button onClick={loadMore} className="load-more-btn">
                                    Load More
                                </button>
                            )}</center>
                            <br />

                        </div>
                        {/* RightSideBarHoster Component */}
                        <RightSideBarHoster />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default GameCategoryZone;
