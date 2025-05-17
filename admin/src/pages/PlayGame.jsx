import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import Loader from "../components/Loader";
import "../components/Pagination.css";
import axios from "/config/axiosConfig";
import $ from 'jquery';  // Import jQuery (if using in React/Vue)

import LeftSideBarComponent from "../components/LeftSideBarComponent";

const PlayGame = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to control sidebar visibility
  const { getToken, token, logout } = AuthUser();
  const buttonRef = useRef(null); // Create a ref for the button
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const [gallerys, setApiGalleryData] = useState([]);
  const [traceId, setTraceid] = useState("");
  const [embededLink, setEmbedUrl] = useState("");
  const [errors, setErrors] = useState({});
  console.log("play" + slug);

  const [gameUrl, setGameUrl] = useState(null); // State to store game URL

  const convertSlug = slug.toLowerCase();
  const [input1, setInput1] = useState(convertSlug);
  const formRef = useRef(null); // Create a ref for the form
  const [error, setError] = useState("");
  const [ganeName, setGameName] = useState("");
  const [GameImg, setGameImg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const { http, setToken } = AuthUser();
  const [showBackground, setShowBackground] = useState(true);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordlChange = (e) => {
    setPassword(e.target.value);
  };

  const loginGame = async (e) => {
    e.preventDefault();

    try {
      const response = await http.post("/auth/userLogin", {
        username,
        password,
      });
      setToken(response.data.user, response.data.access_token);
      openModalClose();
      navigate(`/play-game/${slug}`);
      // Optionally reload the window to force a refresh
      window.location.reload();
      // Find the play button and click it once after login

    } catch (error) {
      const fieldErrors = error.response?.data.errors || {};
      setErrors({
        general: fieldErrors.account
          ? fieldErrors.account[0]
          : "Invalid username or password.",
        ...fieldErrors,
      });
    }
  };

  // Handle form submission
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (token) {
      setIsPlaying(true); // Play the game if logged in
    } else {
      openModalLogin(true); // Open the login modal if not logged in
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const formData = new FormData();
      formData.append("input1", input1);
      formData.append("slug", slug);
      const response = await axios.post("/games/requesttoGame", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === false) {
        // Handle errors
        const gameCode = response.data.code;
        const errorMessages = {
          10001: `Insufficient balance, withdrawal failed ${gameCode}`,
          10002: `Signature verification failed ${gameCode}`,
          10003: `Order in process ${gameCode}`,
          10004: `Order does not exist ${gameCode}`,
          10005: `Duplicate order ${gameCode}`,
          10006: `Request too frequent ${gameCode}`,
          10007: `Cannot transfer funds while in game ${gameCode}`,
          10008: `Game is closed ${gameCode}`,
          10009: `Invalid parameter ${gameCode}`,
          10010: `Operation failed ${gameCode}`,
          10011: `Player login token verification failed ${gameCode}`,
          10012: `Invalid app_id ${gameCode}`,
          10013: `Player does not exist ${gameCode}`,
          10014: `Player banned ${gameCode}`,
          10015: `Internal server error ${gameCode}`,
          10016: `Game does not exist ${gameCode}`,
          10017: `Game not available ${gameCode}`,
          10018: `The merchant has been disabled ${gameCode}`,
          10019: `Unsupported currency ${gameCode}`,
          10020: `Transfer transaction does not exist ${gameCode}`,
          10021: `Merchant wallet type is incorrect ${gameCode}`,
          10022: `Merchant corresponding to the passed app_id does not exist ${gameCode}`,
        };

        if (errorMessages[gameCode]) {
          setError(errorMessages[gameCode]);
        } else {
          setError("An unknown error occurred.");
        }
      } else {

        // Success: Set the game URL
        setGameUrl(response.data.url);
        setError(""); // Clear any previous errors
        setTraceid(response.data.traceId); // Set categories to the state
      }
      // setGameUrl(response.data.url);
      // window.location.href = response.data.url;
    } catch (err) {
      // Handle other errors (e.g., network errors)
      console.error("Error Response:", err.response);
      const responseData = err.response.data;
      const errorMessage =
        responseData.error || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Set loading to false
    }
  };
  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };


  const getVideoEmbededurl = async (api_id) => {
    //alert("Video APPID: " + api_id);
    const response = await axios.get(`/public/checkVideoAppId`, {
      params: { api_id },
    });
    console.log("===" + response.data.data.embed);
    setEmbedUrl(response.data.data.embed);
    setGameUrl(gameUrl); // Replace with actual game URL
    setIsPlaying(true); // Set the game as playing
    //setShowBackground(false);
  }

  const galleryData = async () => {
    try {
      const response = await axios.get(`/public/galleryApiData`);

      if (response.data && Array.isArray(response.data)) {
        setApiGalleryData(response.data); // Set categories to the state
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getGameDetails = async () => {
    try {
      const response = await axios.get(`/public/checkGameData`, {
        params: { slug },
      });
      setGameName(response.data.data.name);
      setGameImg(response.data.game_images);
      //setTotalPages(response.data.last_page); // Get total pages from response
    } catch (error) {
      console.error("Error Data:", error);
    }
  };



  // Automatically submit the form after the component mounts
  useEffect(() => {

    if (token) {  // Check if token is present
      const e = { preventDefault: () => { } }; // Create a mock event to pass to handleSubmit
      if (formRef.current) {
        // Directly call the handleSubmit function
        handleSubmit(e);  // Pass the mock event object to the handler
        setIsPlaying(true); // Play the game if logged in
      }
    } else {
      openModalLogin(true); // Open the login modal if not logged in
    }

    if (traceId) {
      console.log("traceId updated in state:", traceId);
      //  checkVerifySession(); // Call when traceId updates
    }
    galleryData();
    getGameDetails();
    //handleSubmit(new Event('submit', { bubbles: true })); // Programmatically trigger form submission
  }, [traceId, token]); // Empty dependency array means this runs once after initial render
  const modalRef = useRef(null);
  const openModalLogin = () => {
    const modalElement = new window.bootstrap.Modal(modalRef.current);
    modalElement.show(); // Opens the modal
  };

  const openModalClose = () => {
    const modalElement = window.bootstrap.Modal.getInstance(modalRef.current);
    if (modalElement) {
      modalElement.hide(); // This will close the modal
    }
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
          {/* Modal */}
          <div
            className="modal fade"
            ref={modalRef}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark">
                <div className="modal-body">
                  <form onSubmit={loginGame} className="mx-auto mb-3">
                    <center>
                      <Link to="/">
                        <img
                          src="/images/LOGO.png"
                          className="img-fluid login_logo"
                        />
                      </Link>
                    </center>
                    <center>
                      {errors.account && (
                        <div style={{ color: "red" }}>{errors.account[0]}</div>
                      )}
                    </center>
                    <div className="row">
                      <div className="col-md-10 m-auto">
                        <div className="py-4 px-2">
                          <h3 className="text-center mb-2">Please login</h3>
                          <div className="form-group mb-2">
                            <label>Email</label>
                            <input
                              type="text"
                              placeholder="example@mail.com"
                              className="form-control"
                              value={username}
                              onChange={handleUsernameChange}
                            />
                            {errors.username && (
                              <div style={{ color: "red" }}>
                                {errors.username[0]}
                              </div>
                            )}
                          </div>
                          <div className="form-group mb-3">
                            <label>Password</label>
                            <div className="input_group_pass">
                              <input
                                type="password"
                                id="password"
                                placeholder="********"
                                className="form-control"
                                value={password}
                                onChange={handlePasswordlChange}
                              />
                              <i
                                className="fa-solid fa-eye"
                                id="togglePassword"
                              />
                              {errors.password && (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.password[0]}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn_main mb-3 w-100"
                          >
                            Login
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Bootstrap Modal */}
          <div className={`modal fade ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!isModalOpen}>
            <div className="modal-dialog modal-lg" style={{ maxWidth: "100%", height: "100vh" }} role="document">
              <div className="modal-content">
                <div className="modal-header" style={{
                  backgroundColor: "rgb(41, 45, 46)", // Blue background color
                  color: "#fff", // White text color
                  borderTopLeftRadius: "10px", // Rounded corners for the top left
                  borderTopRightRadius: "10px", // Rounded corners for the top right
                  padding: "15px 25px", // More padding for the header
                  textAlign: "center", // Center the title
                  position: "relative", // Relative position to position the close button
                }}>
                  <h5 className="modal-title" id="exampleModalLabel" style={{
                    fontWeight: "bold", // Make the title bold
                    fontSize: "1.25rem", // Slightly larger font size
                  }}>Play Game</h5>
                  {/* Updated Close Button with Absolute Positioning for Top-Right Corner */}
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={closeModal}
                    style={{
                      position: "absolute", // Position it absolutely in the top-right corner
                      top: "10px", // Distance from the top of the modal
                      right: "10px", // Distance from the right of the modal
                      color: "#fff", // White color for close button
                      fontSize: "1.5rem", // Larger close button font
                      backgroundColor: "#dc3545", // Red background color for the button
                      border: "none", // No border
                      borderRadius: "50%", // Circle shape
                      width: "40px", // Set width
                      height: "40px", // Set height
                      display: "flex", // Flex to center icon
                      justifyContent: "center", // Center horizontally
                      alignItems: "center", // Center vertically
                      cursor: "pointer", // Change cursor to pointer on hover
                      transition: "background-color 0.3s", // Smooth transition for background color
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"} // Hover color effect
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"} // Revert on hover leave
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{ padding: 0, height: "calc(100vh - 56px)" }}>
                  <iframe
                    src={gameUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    title="Game"
                  />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} ref={formRef} id="yourFormId">
            <div className="d-none">
              <label htmlFor="input1">GameCode:</label>
              <input
                type="text"
                id="input1"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                required
              />
            </div>

            <br />



            <div className="row">
              <div className="col-xl-9">
                <div className="text-center">
                  {error && (
                    <div className="bg-danger text-white p-2">{error}</div>
                  )}
                </div>

                {/* GameSlider Component */}
                {loading ? (
                  <div className="text-center">
                    <Loader />
                    <div className="loading-indicator">
                      <img src="/images/loader.gif" alt="loading" />
                      <span className="text-black">Loading.....</span>
                    </div>
                  </div>
                ) : (
                  <div>{/* Main content goes here */}</div>
                )}

                {/* Game Display Section */}
                <div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "560px",
                      border: "2px solid rgb(214, 37, 95)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "rgb(35, 38, 38)",
                      overflow: "hidden",
                      background: `url('/images/game_play.png') no-repeat center`,
                    }}
                  >
                    {!isPlaying && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 10,
                          cursor: "pointer",
                          color: "#fff",
                          borderRadius: "50%",
                          width: "80px",
                          height: "80px",
                          display: "flex",

                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={handlePlay}
                      >
                        <i
                          className="fas fa-play"
                          style={{
                            fontSize: "32px",
                            color: "rgb(214, 37, 95)",
                          }}
                        />
                      </div>
                    )}

                    {!embededLink && isPlaying && (
                      <iframe
                        src={gameUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        title="Game"
                      />
                    )}

                    {embededLink && gameUrl && isPlaying && (
                      <div style={{ display: "flex", gap: "0px" }}>
                        {/* Left Column for the Game iframe */}
                        <div style={{ flex: 1, height: "700px" }}>
                          <iframe
                            src={gameUrl}
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "none",
                            }}
                            title="Game"
                          />
                        </div>

                        {/* Right Column for Video Embed */}
                        <div style={{ flex: 1, height: "700px" }}>
                          <iframe
                            src={embededLink}
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "none",
                            }}
                            title="Video"
                          />
                        </div>
                      </div>
                    )}


                    {/* END */}

                  </div>
                </div>
                {token ? (
                  <>
                    <div className="row mt-1">

                    {embededLink ? (
                      <>
                      <div className="col-md-3">
                        <button className="btn btn_signup w-100 finalyplaygame" type="submit" disabled={loading} onClick={handlePlay} >
                          <i className="fa-solid fa-play"></i> {loading ? "Loading..." : "Play Game"}
                        </button>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn_signup w-100" onClick={openModal}> <i className="fas fa-expand"></i> Game Full Screen </button>
                      </div>

                      
                      
                      </>  ) : (
                        <>
                        <div className="col-md-6">
                        <button className="btn btn_signup w-100 finalyplaygame" type="submit" disabled={loading} onClick={handlePlay} >
                          <i className="fa-solid fa-play"></i> {loading ? "Loading..." : "Play Game"}
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button className="btn btn_signup w-100" onClick={openModal}> <i className="fas fa-expand"></i> Game Full Screen </button>
                      </div>

                        
                        
                        
                        </>  )}
                      

                    </div>
                  </>
                ) : (
                  <>
                    <button className="btn btn_signup w-100 mt-1" type="button" onClick={openModalLogin}>
                      {loading ? "Loading..." : "Play"}
                    </button>
                  </>
                )}
              </div>

              <div className="col-xl-3">
                <center
                  style={{
                    paddingBottom: "1px",
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  <strong>{ganeName}</strong>
                </center>

                <center><img
                  src={GameImg}
                  className="ads_image img-fluid text-center"
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
                  }}
                  alt="Game"
                /></center>

                <div className="home_hoster">
                  {gallerys.length > 0 ? (
                    gallerys.map((gallery, index) => (
                      <div className="hoster_" key={index}>
                        <Link className="home_hoster_link" onClick={() => getVideoEmbededurl(gallery.api_id)}>
                          <img
                            src={gallery.imagepath}
                            className="img-fluid"
                            style={{
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow
                              borderRadius: "10px", // Optional: Rounded corners
                              transition: "transform 0.2s, box-shadow 0.2s", // Smooth hover effect
                            }}
                            onMouseEnter={(e) => (e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)")} // Increase shadow on hover
                            onMouseLeave={(e) => (e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)")} // Reset shadow on hover leave
                          />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p>No gallery images available</p>
                  )}
                </div>

              </div>

            </div>

            {/* END */}


          </form>


          <br />
        </div>

        {/* RightSideBarHoster Component */}

      </div>



    </>
  );

};

export default PlayGame;
