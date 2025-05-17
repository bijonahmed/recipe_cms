import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const RoomPreview = () => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const { id } = useParams();
  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const [roomsize, setRoomSize] = useState([]);
  const [bedtypes, setBedTypes] = useState([]);
  const [roomimages, setRoomImages] = useState([]);
  const [facilitiesData, setSelectedFacilitiesData] = useState([]);

  const [formData, setFormData] = useState({
    roomType: "",
    capacity: "",
    roomPrice: "",
    bedNumber: "",
    bedType: "",
    roomDescription: "",
    reserveCondition: "",
    status: "1", // Default value
  });

  const defaultFetch = async () => {
    try {
      const response = await axios.get(`/roomsetting/checkRoomRow`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // or simply { userId } using shorthand
      });
      const userData = response.data;
      setFormData((prev) => ({
        ...prev,
        ...userData, // Assuming userData has the same structure
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const filterRoomImages = async () => {
    try {
      const response = await axios.get(`/roomsetting/filterRoomImage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // or simply { userId } using shorthand
      });
      const imagesData = response.data;
      // console.log("API response imagesData:", imagesData); // Debugging: Check API response
      setRoomImages(imagesData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const checkSelectedFacilities = async () => {
    try {
      const response = await axios.get(`/roomsetting/checkselectedfacilities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // or simply { userId } using shorthand
      });
      const userData = response.data;
      setSelectedFacilitiesData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));

        const response = await axios.get(`/roomsetting/delteRoomImages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { id: id },
        });
        filterRoomImages();

        Swal.fire("Deleted!", "Your data has been deleted.", "success");
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };
  const getBedTypes = async () => {
    try {
      const response = await axios.get(`/roomsetting/getsBetType`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setBedTypes(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const navigate = useNavigate();
  const handleAddNewClick = () => {
    navigate("/roomsetting/room-list");
  };

  useEffect(() => {
    defaultFetch();
    getBedTypes();
    filterRoomImages();
    checkSelectedFacilities();
  }, []);

  return (
    <>
      <Helmet>
        <title>Room Preview</title>
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
                <div className="breadcrumb-title pe-3">Room Preview</div>
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
                        Room Preview
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="ms-auto">
                  <button
                    type="button"
                    className="btn btn-black"
                    onClick={handleAddNewClick}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="card radius-10 p-4">
                <div className="row">
                  {/* Left Side - Image Slider */}
                  <div className="col-md-5">
                    <div
                      id="roomCarousel"
                      className="carousel slide"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {roomimages.map((image, index) => (
                          <div
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                            key={index}
                          >
                            <img
                              src={image.roomImage}
                              className="d-block w-100 rounded"
                              alt="Room"
                              style={{ height: "250px", objectFit: "cover" }}
                            />
                            {/* Delete Icon */}
                          </div>
                        ))}
                      </div>
                      {/* Carousel Controls */}
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#roomCarousel"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#roomCarousel"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Booking Details */}
                  <div className="col-md-7">
                    <h5 className="mb-3">Booking Preview</h5>
                    <div className="booking-details">
                      {[
                        { label: "Room Type", value: formData.roomType },
                        { label: "Capacity", value: formData.capacity },
                        {
                          label: "Room Price",
                          value: `${formData.roomPrice} BDT 1 NIGHT`,
                        },
                        {
                          label: "Bed Type",
                          value:
                            bedtypes.find((bed) => bed.id === formData.bedType)
                              ?.name || "Select Bed Type",
                        },
                        {
                          label: "Room Description",
                          value: formData.roomDescription,
                        },
                        {
                          label: "Status",
                          value: formData.status === 1 ? "Active" : "Inactive",
                        },
                      ].map((item, index) => (
                        <div className="row mb-2" key={index}>
                          <label className="col-sm-4 fw-bold">
                            {item.label}:
                          </label>
                          <div className="col-sm-8">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card radius-10">
                <div className="card-body">
                  <div className="container-fluid">
                    <div className="row">
                      {roomimages.map((rimages, index) => (
                        <div className="col-3 mb-3" key={index}>
                          <div className="card">
                            <img
                              src={rimages.roomImage} // Ensure this is a valid image URL
                              alt="Room"
                              className="card-img-top"
                              style={{ height: "150px", objectFit: "cover" }} // Adjust as needed
                            />
                            <div className="card-body text-center">
                              <span className="card-text">
                                {rimages.roomType}
                              </span>
                              <br />
                              <i
                                className="fas fa-trash text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDelete(rimages.id)}
                              ></i>{" "}
                              {/* Font Awesome Trash Icon */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Group Name</th>
                      <th>Facilities Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilitiesData.length > 0 ? (
                      facilitiesData.reduce((acc, data, index, array) => {
                        const isFirstOccurrence =
                          index === 0 ||
                          data.facility_group_name !==
                            array[index - 1].facility_group_name;

                        acc.push(
                          <tr key={data.id}>
                            <td></td>

                            {/* Show Group Name only for the first row of each group */}
                            {isFirstOccurrence ? (
                              <td
                                rowSpan={
                                  array.filter(
                                    (item) =>
                                      item.facility_group_name ===
                                      data.facility_group_name
                                  ).length
                                }
                              >
                                <strong>{data.facility_group_name}</strong>
                              </td>
                            ) : null}

                            <td>{data.facilities_name}</td>
                          </tr>
                        );

                        return acc;
                      }, [])
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No facilities found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

export default RoomPreview;
