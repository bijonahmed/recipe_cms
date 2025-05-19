import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const RecipesDetails = () => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState({});
  const [comments, setComments] = useState([]);
  const [recepiData, setRecepiData] = useState("");
  const [recpImg, setRecepiImg] = useState("");
  const [liked, setLiked] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const { slug } = useParams();
  const [imageLoaded, setImageLoaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetchSlugData = async () => {
    try {
      const response = await axios.get(`/public/getSlugData`, {
        params: { slug }, // Automatically converts to ?slug=value
      });
      // console.log("===" + response.data.thumnail_img);
      setRecepiData(response.data.data);
      setRecepiImg(response.data.thumnail_img);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchCommentData = async () => {
    try {
      const response = await axios.get(`/public/getCommentsData`, {
        params: { slug }, // Automatically converts to ?slug=value
      });
      // console.log("===" + response.data.thumnail_img);
      setComments(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchGlobalData = async () => {
    try {
      const response = await axios.get(`/public/getGlobalData`);
      setName(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const [formData, setFormData] = useState({
    comment: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comment) return;
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formDataObj = new FormData();
      formDataObj.append("comment", formData.comment);
      formDataObj.append("slug", slug);

      const response = await axios.post("/user/commentSubmit", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Show success message
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Comment submitted successfully.",
      });
      fetchCommentData();
      // Add new comment to UI
      setComments([
        { name: formData.name, message: formData.comment },
        ...comments,
      ]);

      // Clear the form
      setFormData({ name: "", email: "", comment: "" });
      setErrors({});
    } catch (error) {
      if (error.response && error.response.status === 422) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        console.error("Error submitting comment:", error);
      }
    }
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await axios.post(
        "/post/userlike",
        { slug },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === "Liked") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else if (response.data.message === "Disliked") {
        setLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  // Optional: Load saved likes from localStorage
  // Optional: Save likes to localStorage on change

  useEffect(() => {
    fetchCommentData();
    fetchSlugData();
    fetchGlobalData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Recipes Detail</title>
      </Helmet>
      <Header />

      <div>
        <div className="bg-white py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 col-md-10 col-12">
                <div className="text-center">
                  <h1 className="fw-bold pb-2 display-1 text-black">
                    {" "}
                    {recepiData.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All recipes */}
        <div className="pb-5">
          <div className="container pb-5">
            <div className="row justify-content-center">
              <div className="col-lg-12 col-md-10 col-12">
                <div
                  style={{
                    height: "500px",
                    backgroundColor: "#fff", // white background
                    border: "4px solid white", // white border
                    borderRadius: "1rem",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={recpImg}
                    alt={recepiData.name}
                    className="card-img-top rounded-top-4"
                    style={{
                      height: "500px",
                      objectFit: "cover",
                      display: imageLoaded ? "block" : "none",
                      width: "100%",
                    }}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="p-0">
                  <div className="border-bottom py-3">
                    <h3 className="card-title fw-bold">{recepiData.name}</h3>
                    <p className="card-text fst-italic">
                      Recipe by {recepiData.recip_by}
                    </p>

                    <p
                      style={{ textAlign: "justify" }}
                      className="text-muted"
                      dangerouslySetInnerHTML={{
                        __html: recepiData.description,
                      }}
                    ></p>
                  </div>
                  <p className="text-muted py-2">
                    Course:{" "}
                    <span className="text-dark">{recepiData.cateName}</span>
                    <span className="mx-2">/</span>Cuisine:{" "}
                    <span className="text-dark">{recepiData.cuisine}</span>
                    <span className="mx-2">/</span>Difficulty:{" "}
                    <span className="text-dark">{recepiData.cuisine}</span>
                  </p>
                  <div className="row row-cols-4 g-0 border mb-4 rounded-4">
                    <div className="col border-end">
                      <div className="text-center p-4">
                        <i className="ri-restaurant-fill ri-2x text-secondary-emphasis" />
                        <p className="fw-bold mb-0">Servings</p>
                        <small className="text-muted">
                          {recepiData.servings}
                        </small>
                      </div>
                    </div>
                    <div className="col border-end">
                      <div className="text-center p-4">
                        <i className="ri-alarm-fill ri-2x text-secondary-emphasis" />
                        <p className="fw-bold mb-0">Prep time</p>
                        <small className="text-muted">
                          {recepiData.preparation_time}
                        </small>
                      </div>
                    </div>
                    <div className="col border-end">
                      <div className="text-center p-4">
                        <i className="ri-cup-fill ri-2x text-secondary-emphasis" />
                        <p className="fw-bold mb-0">Cooking time</p>
                        <small className="text-muted">
                          {recepiData.cooking_time}
                        </small>
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-center p-4">
                        <i className="ri-fire-fill ri-2x text-secondary-emphasis" />
                        <p className="fw-bold mb-0">Calories</p>
                        <small className="text-muted">
                          {recepiData.calories}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="bg-warning-subtle rounded-4 p-4 mb-4">
                    <h5 className="fw-bold">INGREDIENTS</h5>

                  {recepiData?.ingredients ? (
  <p
    style={{ textAlign: "justify" }}
    className="text-muted"
    dangerouslySetInnerHTML={{
      __html: recepiData.ingredients.replace(/\n/g, "<br />"),
    }}
  ></p>
) : (
  <p className="text-muted">Loading ingredients...</p>
)}

                  </div>
                </div>
              </div>

              <div className="col-xl-12 col-lg-8 col-md-10 col-12">
                <br />

                {/* Like Button Section */}
                <div className="d-flex justify-content-end align-items-center gap-3 mb-4">
                  <button
                    className={`btn ${
                      liked ? "btn-danger" : "btn-outline-danger"
                    }`}
                    onClick={handleLike}
                    disabled={loading}
                  >
                    {liked ? "💔 Dislike" : "❤️ Like"} ({likeCount})
                  </button>
                  {/* <span className="fw-bold">{likecount} Likes</span> */}
                </div>

                {/* Leave a reply */}
                <div className="bg-light p-5 rounded-5 mt-5">
                  <h5 className="fw-bold mb-4">Comments</h5>
                  <ul className="list-unstyled">
                    {comments.map((c, i) => (
                      <li key={i} className="mb-3 border-bottom pb-2">
                        <strong>{c.name}</strong>
                        <p className="mb-0">{c.message}</p>
                      </li>
                    ))}
                  </ul>

                  <hr className="my-4" />

                  <form onSubmit={handleSubmit}>
                    <textarea
                      className="form-control bg-transparent mb-3"
                      name="comment"
                      rows={6}
                      placeholder="Type your comment *"
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                    />
                    <button type="submit" className="btn btn-danger btn-lg">
                      Post Comment
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecipesDetails;
