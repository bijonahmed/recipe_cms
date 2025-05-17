import React, { useState, useEffect } from "react";
import axios from "/config/axiosConfig";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sliders = () => {
  const [sliders, setSliders] = useState("");
  const navigate = useNavigate();
 const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get("/public/getSliders");
         setSliders(response.data.data);
      } catch (error) {
        console.error("Error fetching sliders:", error);
      }
    };

    fetchSliders();
  }, []);

  return (
    <div className="bg-warning-subtle py-5">
      <div className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 col-12">
            <a
              href="#"
              className="badge text-bg-danger rounded-pill px-3 py-2 text-uppercase"
            >
              Receipe of the day
            </a>
            <h1 className="fw-bold display-2 py-2 text-black">
               {sliders.title_name}
            </h1>

            <p className="demo lead">
               {sliders.description}
            </p>


            <div className="d-flex align-items-center gap-3 mt-5">
              <Link
                to="/recipes"
                className="btn btn-danger btn-lg rounded-pill"
              >
                <i className="ri-book-open-fill me-2" />
                Cook Now
              </Link>
              <Link
                to="/recipes"
                className="btn btn-outline-danger btn-lg rounded-pill"
              >
                <i className="ri-search-eye-fill me-2" />
                Explore Receipes
              </Link>
            </div>
          </div>
          <div className="col-lg-6 col-12">
             <div style={{ position: "relative", minHeight: "200px" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Simple loader */}
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <img
        src={sliders.sliderImage}
        alt=""
        className="img-fluid rounded-4"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)} // also hide loader if error occurs
        style={loading ? { display: "none" } : { display: "block" }}
      />
    </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sliders;
