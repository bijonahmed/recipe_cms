import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import Pagination from "../../components/Pagination";
import axios from "/config/axiosConfig";
import "../../components/css/RoleList.css";
import Swal from "sweetalert2";

const RecipeReport = () => {
  const [merchantdata, setMerchantData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [likeData, setLikeData] = useState([]);
  const [data, setData] = useState([]);
  const [booking_id, setBookingId] = useState("");
  const [user_id, setCustomer] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [responserow, setResponseRowData] = useState("");
  const [loading, setLoading] = useState(false);

  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const apiUrl = "/report/filterByRecipieport";
  const navigate = useNavigate();

  const fetchMerchantData = async () => {
    try {
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(`/user/getOnlyMerchantList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.data) {
        setMerchantData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          //searchQuery,
          selectedFilter,
          user_id,
          fromDate,
          toDate,
        },
      });

      if (response.data) {
        setData(response.data);
        // setTotalPages(response.data.total_pages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRowDetails = async (id) => {
    try {
      const response = await axios.get(`/post/reciperowCheck`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // or simply { userId } using shorthand
      });

      setResponseRowData(response.data.data);
      setTimeout(() => {
        const myModal = new bootstrap.Modal(
          document.getElementById("recipeModal")
        );
        myModal.show();
      }, 100);
      //console.log("API response data:", response.data.data.name); // Debugging: Check API response
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getLikeRows = async (id) => {
    try {
      const response = await axios.get(`/post/reciperLikerows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // or simply { userId } using shorthand
      });

      setLikeData(response.data.data);
      setTimeout(() => {
        const myModal = new bootstrap.Modal(
          document.getElementById("recipeLikeModal")
        );
        myModal.show();
      }, 100);
      //console.log("API response data:", response.data.data.name); // Debugging: Check API response
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getCommentRow = async (id) => {
    try {
      const response = await axios.get(`/post/recipeComment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // or simply { userId } using shorthand
      });

      setCommentData(response.data.data);
      setTimeout(() => {
        const myModal = new bootstrap.Modal(
          document.getElementById("recipeCommentModal")
        );
        myModal.show();
      }, 100);
      //console.log("API response data:", response.data.data.name); // Debugging: Check API response
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getRowEdit = async (id) => {
    navigate(`/recipe/edit/${id}`);
  };

  const commentDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this comment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.get(`/post/deleteComments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setTimeout(() => {
            const myModalEl = document.getElementById("recipeCommentModal");
            const myModal = bootstrap.Modal.getInstance(myModalEl); // get existing instance
            if (myModal) {
              myModal.hide();
            }
          }, 100);

          Swal.fire("Deleted!", "The comment has been deleted.", "success");
          fetchData();
        } else {
          Swal.fire("Error", "Failed to delete the comment.", "error");
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the comment.",
        "error"
      );
    }
  };

  const deleterow = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the recipe permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.get(`/post/deleteRow`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { id: id },
        });

        Swal.fire("Deleted!", "The recipe has been deleted.", "success");
        fetchData(); // Refresh data
      } catch (error) {
        console.error("Error deleting data:", error);
        Swal.fire("Error!", "Something went wrong. Please try again.", "error");
      }
    }
  };

  useEffect(() => {
    const today = new Date();
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - 20);

    // Format: YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    setToDate(formatDate(today));
    setFromDate(formatDate(priorDate));
  }, []);

  // Correctly closed useEffect hook
  useEffect(() => {
    fetchData();
    fetchMerchantData();
  }, [selectedFilter, user_id, fromDate, toDate]);

  return (
    <>
      <Helmet>
        <title>Recipe Report</title>
      </Helmet>

      <div>
        <div className="wrapper">
          <LeftSideBarComponent />
          <header>
            <GuestNavbar />
          </header>

          <div className="page-wrapper">
            <div className="page-content">
              <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Recipe Report</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item">
                        <Link to="/dashboard">
                          <i className="bx bx-home-alt" />
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Report
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="card radius-10">
                <div className="card-body">
                  <div className="container-fluid">
                    <div className="search-pagination-container">
                      <div className="row align-items-center mb-3">
                        <div className="col-12 col-md-3 mb-2 mb-md-1">
                          <select
                            style={{ height: "46px", marginTop: "19px" }}
                            className="form-select"
                            value={user_id}
                            onChange={(e) => setCustomer(e.target.value)} // ✅ This line is important
                            id="input46"
                          >
                            <option value="">All Users</option>
                            {merchantdata.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* From Date */}
                        <div className="col-12 col-md-3 mb-2 mb-md-0 mt-3">
                          <div className="searchbar">
                            <input
                              type="date"
                              className="form-control"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* To Date */}
                        <div className="col-12 col-md-3 mb-2 mb-md-0 mt-3">
                          <div className="searchbar">
                            <input
                              type="date"
                              className="form-control"
                              value={toDate}
                              onChange={(e) => setToDate(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-3 mb-2 mb-md-0 mt-3">
                          <div className="searchbar">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={fetchData}
                            >
                              Filter
                            </button>
                          </div>
                        </div>
                      </div>

                      {loading ? (
                        <div className="d-flex justify-content-center mt-3">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table align-middle mb-0 table-hover">
                            <thead className="table-light">
                              <tr>
                                <th className="text-left">Id</th>
                                <th className="text-left">UserName</th>
                                <th className="text-left">Post Image</th>
                                <th className="text-left">Post Title</th>
                                <th className="text-left">No of Comment</th>
                                <th className="text-left">No of Like</th>
                                <th className="text-center">Created At</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.length > 0 ? (
                                data.map((item, index) => (
                                  <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td className="text-left">
                                      {item.username}
                                    </td>
                                    <td className="text-left">
                                      <img
                                        src={item.thumbnailimg}
                                        alt="Thumbnail"
                                        className="img-fluid"
                                        style={{
                                          width: "100%",
                                          height: "auto",
                                          maxWidth: "150px",
                                        }} // Adjust maxWidth as needed
                                      />
                                    </td>
                                    <td className="text-left">{item.name}</td>
                                    <td className="text-left">
                                      {item.noComment}
                                    </td>
                                    <td className="text-left">{item.noLike}</td>
                                    <td className="text-center">
                                      {item.formatted_date}
                                    </td>

                                    <td className="text-center">
                                      <span
                                        className={`badge ${
                                          item.status === 1
                                            ? "bg-success"
                                            : item.status === 0
                                            ? "bg-warning"
                                            : "bg-secondary"
                                        } text-white shadow-sm w-100`}
                                      >
                                        {item.status === 1
                                          ? "Active"
                                          : item.status === 0
                                          ? "Pending"
                                          : "Unknown"}
                                      </span>
                                    </td>
                                    <th className="text-center">
                                      <div
                                        className="btn-group"
                                        role="group"
                                        aria-label="Action Buttons"
                                      >
                                        <button
                                          className="btn btn-primary btn-sm"
                                          onClick={() => getRowDetails(item.id)}
                                        >
                                          View
                                        </button>
                                        <button
                                          className="btn btn-secondary btn-sm"
                                          onClick={() => getRowEdit(item.id)}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="btn btn-info btn-sm"
                                          onClick={() => getCommentRow(item.id)}
                                        >
                                          Comment
                                        </button>
                                        <button
                                          className="btn btn-warning btn-sm"
                                          onClick={() => getLikeRows(item.id)}
                                        >
                                          Like
                                        </button>
                                        <button
                                          className="btn btn-danger btn-sm"
                                          onClick={() => deleterow(item.id)}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </th>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="9" className="text-center">
                                    No data found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overlay toggle-icon" />
          <Link to="#" className="back-to-top">
            <i className="bx bxs-up-arrow-alt" />
          </Link>
          <Footer />
          {/* Recipe Info */}
          <div
            className="modal fade"
            id="recipeModal"
            tabIndex="-1"
            aria-labelledby="recipeModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="recipeModalLabel">
                    Recipe Info
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {responserow ? (
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <td>{responserow.name}</td>
                        </tr>
                        <tr>
                          <th>Description</th>
                          <td>{responserow.description}</td>
                        </tr>
                        <tr>
                          <th>Ingredients</th>
                          <td>{responserow.ingredients}</td>
                        </tr>
                        <tr>
                          <th>Category</th>
                          <td>{responserow.category_name}</td>
                        </tr>
                        <tr>
                          <th>Cuisine</th>
                          <td>{responserow.cuisine}</td>
                        </tr>
                        <tr>
                          <th>Difficulty</th>
                          <td>{responserow.difficulty}</td>
                        </tr>
                        <tr>
                          <th>Servings</th>
                          <td>{responserow.servings}</td>
                        </tr>
                        <tr>
                          <th>Preparation Time</th>
                          <td>{responserow.preparation_time}</td>
                        </tr>
                        <tr>
                          <th>Cooking Time</th>
                          <td>{responserow.cooking_time}</td>
                        </tr>
                        <tr>
                          <th>Calories</th>
                          <td>{responserow.calories}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* For Like Modal */}
          <div
            className="modal fade"
            id="recipeLikeModal"
            tabIndex="-1"
            aria-labelledby="recipeLikeModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="recipeLikeModalLabel">
                    Recipe Like List
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Like By</th>
                        <th>LIke On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {likeData && likeData.length > 0 ? (
                        likeData.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{index + 1}</td>
                            <td>{item.userName}</td>
                            <td>{item.created_at_formatted}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No like found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* For Comment modal  */}
          <div
            className="modal fade"
            id="recipeCommentModal"
            tabIndex="-1"
            aria-labelledby="recipeCommentModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="recipeCommentModalLabel">
                    Recipe Comment List
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Comment</th>
                        <th>Comment On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commentData && commentData.length > 0 ? (
                        commentData.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{index + 1}</td>
                            <td>{item.comment}</td>
                            <td>{item.created_at_formatted}</td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => commentDelete(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No comments found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeReport;
