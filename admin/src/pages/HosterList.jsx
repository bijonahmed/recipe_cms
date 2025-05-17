import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LeftSideBarComponent from "../components/LeftSideBarComponent";
import SliderComponent from "../components/SliderComponent";
import GameSlider from "../components/GameSlider";
import axios from "/config/axiosConfig";
import '../components/hosterlist.css';

const HosterList = () => {
  const navigate = useNavigate();

  const [gallerys, setGallerys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Start with page 1
  const [hasMore, setHasMore] = useState(true); // Flag to track if there's more data
  const [progress, setProgress] = useState(0); // Progress bar state

  const fetchGallerys = async () => {
    setLoading(true);
    setProgress(0); // Reset progress
    let progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval); // Stop progress at 100%
          return 100;
        }
        return prevProgress + 10;
      });
    }, 100); // Increment progress every 100ms
    try {
      const response = await axios.get(`/public/getAllHosters`, {
        params: { page } // Pass the current page as a query parameter
      });
      console.log('API Response:', response.data); // Log the response

      const newGallerys = response.data.data; // Adjust based on your API response structure

      // Ensure newGallerys is an array
      if (Array.isArray(newGallerys)) {
        setGallerys((prevGallerys) => [...prevGallerys, ...newGallerys]);

        // Check if more data is available
        if (newGallerys.length < 10) { // Adjust based on your API pagination
          setHasMore(false);
        }
      } else {
        console.error('Unexpected API response structure:', newGallerys);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial gallery items
  useEffect(() => {
    fetchGallerys(); // Fetch initial data
  }, [page]);

  // Load more gallery items when the button is clicked
  const loadMoreGallerys = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment the page
    }
  };

  const ImageWithFallback = ({ src, alt }) => {
    const [imageSrc, setImageSrc] = useState(src);

    const handleError = () => {
      setImageSrc('/images/model.png'); // Set the default image path
    };

    // Update image source when prop changes
    useEffect(() => {
      setImageSrc(src);
    }, [src]);

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
        <title>Hoster List</title>
      </Helmet>

      <GuestNavbar />
      <div className="main_content">
        <LeftSideBarComponent />

        <div className="main_section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-9">
                <div className="banner_section">
                  <div className="swiper bannerSlider">
                    {/* SliderComponent Component */}
                    <SliderComponent />
                    <div className="swiper-pagination" />
                  </div>
                </div>

                {/* GameSlider Component */}
                <GameSlider />

                <div>
                  <div className="title_section">
                    <a onClick={() => navigate(-1)}>
                      <i className="fa-solid fa-chevron-left" />
                    </a>
                    <h1 className="page_title">Hoster List</h1>
                  </div>
                  {/* Hoster list here */}
                  <div className="main_hosterList">
                    {loading && <p>Loading...</p>}
                    {gallerys.length > 0 ? (
                      gallerys.map((gallery, index) => (
                        <div className="hoster_" key={gallery.id || index}>
                          <Link to={`/hoster-details/${gallery.api_id}`} className="home_hoster_link">
                            <ImageWithFallback
                              src={gallery.thumb_src} />
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p>No hoster available</p>
                    )}

                  </div>
                  <div className="load-more-container">
                    {loading && (
                      <div className="progress-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {/* Load More button */}
                    {hasMore && !loading && (
                      <center><button className="load-more-btn" onClick={loadMoreGallerys}>
                        Load More
                      </button></center>

                    )}
                  </div>
                  <br />
                </div>
              </div>
              {/* RightSideBarHoster Component */}
              <div className="col-xxl-3 d-xxl-block d-none">
                <div className="right_sidebar">
                  <Link to="/games-list/pg">
                    <div className="ads_section">
                      <img
                        src="/images/250x250_Google_ads_size.gif"
                        alt="pic"
                        className="ads_image img-fluid"
                      />
                    </div>
                  </Link>
                  <a href="#">
                    <div className="ads_section_two">
                      <img
                        src="/images/adsbannar.webp"
                        alt="pic"
                        className="ads_image img-fluid"
                      />
                    </div>
                  </a>
                  <div className="slier_header d-none">
                    <h5>Game Providers</h5>
                    <div className="slide_nav">
                      <a href="#">
                        All <i className="fa-regular fa-chevron-right" />
                      </a>
                    </div>
                  </div>
                  <div className="providers_container_two d-none">
                    <a href="#">
                      <img
                        src="/images/providers/providers(1).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(2).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(3).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(4).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(5).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(6).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(7).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(8).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(9).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(10).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(11).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                    <a href="#">
                      <img
                        src="/images/providers/providers(12).png"
                        alt="pic"
                        className="img-fluid"
                      />
                    </a>
                  </div>
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

export default HosterList;
