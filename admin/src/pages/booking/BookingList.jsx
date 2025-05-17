import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import Pagination from "../../components/Pagination";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const BookingList = () => {
  const [bookingrooms, setBookingRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [editingItemId, setEditingItemId] = useState(null);
  const apiUrl = "/booking/checkroomBookingStatus";
  const apiCheckBookingUrl = "/booking/getBookingEditdata";

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    editbookingData(item);
    const modalElement = document.getElementById("bookingModal");
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  };

  const [formData, setFormData] = useState({
    id: "",
    bookingId: editingItemId,
    room_slug: "",
    bookingName: "",
    adult: "",
    child: "",
    message: "",
    arival_from: "",
    phone: "",
  });


  const [formDataInOut, setFormDataInOut] = useState({
    id: "",
    roomslug: "",
    checkin: "",
    checkout: "",
   
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeInOut = (e) => {
    const { name, value } = e.target;
    setFormDataInOut((prev) => ({ ...prev, [name]: value }));
  };

    const handleSubmitCheckInOut = async (e)=>{
      e.preventDefault();
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const response = await axios.post("/booking/bookingUpdateInOut", formDataInOut, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
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
          title: "Your data has been successfully saved.",
        });
  
        console.log("Booking Submitted:", formData);
        const modal = window.bootstrap.Modal.getInstance(
          document.getElementById("bookingModal")
        );
        modal.hide();
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
        } else if (error.response && error.response.status === 409) {
          // Handle booking conflict (room already booked)
          Swal.fire({
            icon: "warning",
            title: "Booking Conflict",
            text: error.response.data.message,
          });
          console.warn("Booking conflict:", error.response.data.message);
        }else{
          console.error("Error updating user:", error);
        }
      }

    }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await axios.post("/booking/bookingUpdate", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

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
        title: "Your data has been successfully saved.",
      });
      fetchData();
      console.log("Booking Submitted:", formData);
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("bookingModal")
      );
      modal.hide();
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
        console.error("Error updating user:", error);
      }
    }
  };

  const editbookingData = async (item) => {
    //console.log("booking-----" + item.id);
    setLoading(true);
    try {
      const rawToken = sessionStorage.getItem("token");
      const token = rawToken?.replace(/^"(.*)"$/, "$1");
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(apiCheckBookingUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          bookingId: item.id,
        },
      });
      const booking = response.data.booking_data;
      //console.log("---------------" + booking.name);
      setFormData({
        id: item.id || "", //this booking id
        bookingName: booking.name || "",
        room_slug: item.roomslug || "",
        adult: booking.adult || "", 
        child: booking.child || "", 
        message: booking.message || "",
        arival_from: booking.arival_from || "",
        phone: booking.phone || "",
      });

      setFormDataInOut({
        id: item.id || "", //this booking id
        roomslug: item.roomslug || "",
        checkin: booking.checkin || "",
        checkout: booking.checkout || "",
      });


    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const rawToken = sessionStorage.getItem("token");
      const token = rawToken?.replace(/^"(.*)"$/, "$1");
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookingRooms(response.data.booking_rooms);
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
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewClick = () => {
    navigate("/booking/add-new-booking");
  };

  // Correctly closed useEffect hook
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Booking List</title>
      </Helmet>

      <div>
        <div className="wrapper">
          <LeftSideBarComponent />
          <header>
            <GuestNavbar />
          </header>

          {/* Large Modal with Form */}
          <div
            className="modal fade"
            id="bookingModal"
            tabIndex="-1"
            aria-labelledby="bookingModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title" id="bookingModalLabel">
                    Edit Booking [{editingItemId}]
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {/* Tabs Navigation */}
                  <ul
                    className="nav nav-tabs mb-3"
                    id="bookingTab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="info-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#info"
                        type="button"
                        role="tab"
                        aria-controls="info"
                        aria-selected="true"
                      >
                        Booking Information
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="checkinout-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#checkinout"
                        type="button"
                        role="tab"
                        aria-controls="checkinout"
                        aria-selected="false"
                      >
                        Check IN/OUT
                      </button>
                    </li>
                  </ul>

                  {/* Tabs Content */}
                  <div className="tab-content" id="bookingTabContent">
                    {/* Booking Information Tab */}


                    <form onSubmit={handleSubmit}>
                    <div
                      className="tab-pane fade show active"
                      id="info"
                      role="tabpanel"
                      aria-labelledby="info-tab"
                    >
                      <div className="mb-3">
                        <label className="form-label">Booking By</label>
                        <input
                          type="text"
                          className="form-control"
                          name="bookingName"
                          value={formData.bookingName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Adult</label>
                        <input
                          type="text"
                          className="form-control"
                          name="adult"
                          value={formData.adult}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Child</label>
                        <input
                          type="text"
                          className="form-control"
                          name="child"
                          value={formData.child}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Arival From</label>
                        <input
                          type="text"
                          className="form-control"
                          name="arival_from"
                          value={formData.arival_from}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Special Request</label>
                        <textarea
                          className="form-control"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">
                          Save Booking
                        </button>
                      </div>
                    </div>
                    </form>



                    {/* Check IN/OUT Tab */}
                    <div
                      className="tab-pane fade"
                      id="checkinout"
                      role="tabpanel"
                      aria-labelledby="checkinout-tab">

                  <form onSubmit={handleSubmitCheckInOut}>
                      <div className="mb-3">
                        <label className="form-label">Check-In Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="checkin"
                          value={formDataInOut.checkin}
                          onChange={handleChangeInOut}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Check-Out Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="checkout"
                          value={formDataInOut.checkout}
                          onChange={handleChangeInOut}
                        />
                      </div>

                      <div className="modal-footer d-none">
                        <button type="submit" className="btn btn-primary">
                          Save Booking
                        </button>
                      </div>
                      </form>




                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-wrapper">
            <div className="page-content">
              <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Booking List</div>
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
                        List
                      </li>
                    </ol>
                  </nav>
                </div>

                <div className="ms-auto">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddNewClick}
                  >
                    Add New Booking
                  </button>
                </div>
              </div>

              <div className="card radius-10">
                <div className="card-body">
                  <div className="container-fluid">
                    <div className="search-pagination-container">
                      {loading ? (
                        <div className="d-flex justify-content-center mt-3">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <div className="card mt-4">
                            <div className="card-header text-center">
                              <h4>Booking Rooms List</h4>
                            </div>
                            <div className="card-body p-0">
                              <table className="table table-striped table-bordered mb-0">
                                <thead className="thead-dark">
                                  <tr>
                                    <th className="text-center">Booking ID</th>
                                    <th
                                      className="text-center"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {" "}
                                      Room Name
                                    </th>
                                    <th
                                      className="text-center"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {" "}
                                      Booking By
                                    </th>
                                    <th className="text-center">
                                      {" "}
                                      Check IN/Out
                                    </th>
                                    <th className="text-center">Days</th>
                                    <th className="text-center">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {bookingrooms.length > 0 ? (
                                    bookingrooms.map((item) => (
                                      <tr key={item.id}>
                                        <td className="text-center">
                                          {item.booking_id}
                                        </td>
                                        <td className="text-center">
                                          {item.roomType}
                                        </td>
                                        <td className="text-center">
                                          {item.name}
                                        </td>
                                        <td className="text-center">
                                          {item.checkin} <br /> {item.checkout}
                                        </td>
                                        <td className="text-center">
                                          {item.total_booking_days}
                                        </td>
                                        <td className="text-center">
                                          <a
                                            href="#"
                                            onClick={() => handleEdit(item)}
                                          >
                                            <i className="lni lni-pencil-alt"></i>
                                            &nbsp;Update
                                          </a>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="5"
                                        className="text-center text-muted"
                                      >
                                        No data found
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
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
        </div>
      </div>
    </>
  );
};

export default BookingList;
