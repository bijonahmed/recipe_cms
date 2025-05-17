import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import Pagination from "../../components/Pagination";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const RoomStatusList = () => {
  const bookingTabRef = useRef(null);

  useEffect(() => {
    // Optional: Set default active tab if needed
    if (bookingTabRef.current) {
      new window.bootstrap.Tab(bookingTabRef.current).show();
    }
  }, []);

  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [bookingrooms, setBookingRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [id, setId] = useState();
  const [booking_id, setBookingId] = useState();
  const [room_id, setRoomId] = useState();

  const apiUrl = "/booking/checkroomBookingStatus";
  const modalRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") setStatus(value);
    if (name === "note") setNote(value);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    // Send status and note to your API or handle as needed
    console.log("bookingID:", id);
    console.log("Status:", status);
    console.log("Note:", note);

    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formPayload = new FormData();
      formPayload.append("id", "");
      formPayload.append("id", id);
      formPayload.append("status", status);
      formPayload.append("note", note);
      formPayload.append("room_id", room_id);
      const response = await axios.post(
        "/booking/checkStatusUpdate",
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const modalInstance = window.bootstrap.Modal.getInstance(
        modalRef.current
      );
      modalInstance?.hide();

      setStatus("");
      setNote("");

      Swal.fire({
        icon: "success",
        title: "Your data has been successful update.",
      });

      fetchData();
      navigate("/booking/room-status-list");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        Swal.fire({
          icon: "error",
          title: "Validation Errors",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating user:", error);
      }
    }
  };

  const handleClick = (item) => {
    console.log("room_id...." + item.room_id);
    setId(item.id);
    setBookingId(item.booking_id);
    setRoomId(item.room_id);
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
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
      setAvailableRooms(response.data.available_rooms);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewClick = () => {
    navigate("/roomsetting/add-room");
  };

  // Correctly closed useEffect hook
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Room Status List</title>
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
                <div className="breadcrumb-title pe-3">Room Status List</div>
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

                <div className="ms-auto d-none">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddNewClick}
                  >
                    Add New
                  </button>
                </div>
              </div>

              <div className="card radius-10">
                <div className="card-body">
                  <div className="container-fluid">
                    {/* Nav Tabs */}
                    <ul className="nav nav-tabs" id="roomTabs" role="tablist">
                      <li
                        className="nav-item"
                        role="presentation"
                        onClick={fetchData}
                      >
                        <button
                          className="nav-link active"
                          id="booking-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#booking"
                          type="button"
                          role="tab"
                          aria-controls="booking"
                          aria-selected="true"
                          ref={bookingTabRef}
                        >
                          Booking Rooms
                        </button>
                      </li>
                      <li
                        className="nav-item"
                        role="presentation"
                        onClick={fetchData}
                      >
                        <button
                          className="nav-link"
                          id="available-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#available"
                          type="button"
                          role="tab"
                          aria-controls="available"
                          aria-selected="false"
                        >
                          Available Rooms
                        </button>
                      </li>
                    </ul>

                    {/* Tab Content */}
                    <div className="tab-content mt-3" id="roomTabsContent">
                      {/* Booking Rooms Tab */}
                      <div
                        className="tab-pane fade show active"
                        id="booking"
                        role="tabpanel"
                        aria-labelledby="booking-tab"
                      >
                        {loading ? (
                          <div className="d-flex justify-content-center mt-3">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
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
                                      <th className="text-center">
                                        Booking ID
                                      </th>
                                      <th className="text-center">Room Name</th>
                                      <th className="text-center">
                                        Booking By
                                      </th>
                                      <th className="text-center">
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
                                            {item.checkin} <br />{" "}
                                            {item.checkout}
                                          </td>
                                          <td className="text-center">
                                            {item.total_booking_days}
                                          </td>
                                          <td className="text-center">
                                            <span
                                              style={{
                                                color: "red",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => handleClick(item)}
                                            >
                                              <i className="fas fa-receipt"></i>{" "}
                                              Checkout
                                            </span>
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan="6"
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

                      {/* Available Rooms Tab */}
                      <div
                        className="tab-pane fade"
                        id="available"
                        role="tabpanel"
                        aria-labelledby="available-tab"
                      >
                        {loading ? (
                          <div className="d-flex justify-content-center mt-3">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <div className="card mt-4">
                              <div className="card-header text-center">
                                <h4>Available Rooms List</h4>
                              </div>
                              <div className="card-body p-0">
                                <table className="table table-striped table-bordered mb-0">
                                  <thead className="thead-dark">
                                    <tr>
                                      <th className="text-center">ID</th>
                                      <th className="text-center">Room Name</th>
                                      <th className="text-center">
                                        Check IN/Out
                                      </th>
                                      <th className="text-center">Days</th>
                                      <th className="text-center">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {availableRooms.length > 0 ? (
                                      availableRooms.map((item) => (
                                        <tr key={item.id}>
                                          <td className="text-center">
                                            {item.id}
                                          </td>
                                          <td className="text-center">
                                            {item.roomType}
                                          </td>
                                          <td className="text-center">
                                            {item.checkin} <br />{" "}
                                            {item.checkout}
                                          </td>
                                          <td className="text-center">
                                            {item.total_booking_days}
                                          </td>
                                          <td className="text-center">
                                            <span
                                              style={{
                                                color: "green",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Available
                                            </span>
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
          </div>

          {/* Start Modal */}
          <div
            className="modal fade"
            ref={modalRef}
            tabIndex="-1"
            aria-hidden="true"
          >
            <form onSubmit={handleSubmitBooking}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Checkout [BookingID:{booking_id}]
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <select
                      className="form-select w-100"
                      value={status}
                      onChange={handleChange}
                      name="status"
                      style={{ width: "200px", marginBottom: "10px" }}
                    >
                      <option value="">Select Status</option>
                      <option value="2">Release</option>
                      {/* <option value="3">Cancel</option> */}
                    </select>

                    <textarea
                      className="form-control w-100"
                      name="note"
                      value={note}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows="4"
                      style={{ width: "400px", marginTop: "10px" }}
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {/* END Modal */}

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

export default RoomStatusList;
