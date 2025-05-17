import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RoomAdd = () => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [roomsize, setRoomSize] = useState([]);
  const [bedtypes, setBedTypes] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const getRoomSize = async () => {
    try {
      const response = await axios.get(`/roomsetting/getsRoomSize`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      //console.log("API response data:", data); // Debugging: Check API response
      setRoomSize(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      //console.log("API response data:", data); // Debugging: Check API response
      setBedTypes(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // From
  const [formData, setFormData] = useState({
    roomType: "",
    capacity: "",
    extraCapacity: "",
    roomPrice: "",
    bedCharge: "",
    roomSize: "",
    bedNumber: "",
    bedType: "",
    roomDescription: "",
    reserveCondition: "",
    status: "1", // Default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.replace(/\D/, "") });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };
  //END

  const handleSubmit = async (formData) => {
    try {
      console.log("checking.....");
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formPayload = new FormData();
      formPayload.append("id", "");
      formPayload.append("roomType", formData.roomType);
      formPayload.append("capacity", formData.capacity);
      formPayload.append("extraCapacity", formData.extraCapacity);
      formPayload.append("roomPrice", formData.roomPrice);
      formPayload.append("bedCharge", formData.bedCharge);
      formPayload.append("roomSize", formData.roomSize);
      formPayload.append("bedNumber", formData.bedNumber);
      formPayload.append("bedType", formData.bedType);
      formPayload.append("roomDescription", formData.roomDescription);
      formPayload.append("reserveCondition", formData.reserveCondition);
      formPayload.append("status", formData.status);

      const response = await axios.post("/roomsetting/roomSave", formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Your data has been successful saved.",
      });

      setFormData({}); // Reset form data
      navigate("/roomsetting/room-list");
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

  const navigate = useNavigate();
  const handleAddNewClick = () => {
    navigate("/roomsetting/room-list");
  };

  useEffect(() => {
    getRoomSize();
    getBedTypes();
  }, []);

  return (
    <>
      <Helmet>
        <title>Add Room</title>
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
                <div className="breadcrumb-title pe-3">Add Room</div>
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
                        Add New
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

              <div className="card radius-10">
                {/* Start */}
                <div className="card-body p-4">
                  <form onSubmit={handleFormSubmit}>
                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Room Type <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="roomType"
                          placeholder="Room Type"
                          value={formData.roomType}
                          onChange={handleChange}
                        />
                        {errors.roomType && (
                          <div style={{ color: "red" }}>{errors.roomType}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Capacity <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="capacity"
                          placeholder="Number of person"
                          value={formData.capacity}
                          onChange={handleNumericChange}
                        />
                        {errors.capacity && (
                          <div style={{ color: "red" }}>{errors.capacity}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3 d-none">
                      <label className="col-sm-3 col-form-label">
                        Extra Capability
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="extraCapacity"
                          placeholder="YES"
                          value={formData.extraCapacity}
                          onChange={handleChange}
                        />
                        {errors.extraCapacity && (
                          <div style={{ color: "red" }}>
                            {errors.extraCapacity}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Room Price <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="roomPrice"
                          placeholder="0"
                          value={formData.roomPrice}
                          onChange={handleNumericChange}
                        />
                        {errors.roomPrice && (
                          <div style={{ color: "red" }}>{errors.roomPrice}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3 d-none">
                      <label className="col-sm-3 col-form-label">
                        Bed Charge <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="bedCharge"
                          placeholder="0"
                          value={formData.bedCharge}
                          onChange={handleNumericChange}
                        />
                        {errors.bedCharge && (
                          <div style={{ color: "red" }}>{errors.bedCharge}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3 d-none">
                      <label className="col-sm-3 col-form-label">
                        Room Size <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-control"
                          name="roomSize"
                          value={formData.roomSize}
                          onChange={handleChange}
                        >
                          <option value="">Select Room Size</option>
                          {roomsize.map((size, index) => (
                            <option key={index} value={size.id}>
                              {size.name}
                            </option>
                          ))}
                        </select>
                        {errors.roomSize && (
                          <div style={{ color: "red" }}>{errors.roomSize}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3 d-none">
                      <label className="col-sm-3 col-form-label">
                        Bed Number <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="bedNumber"
                          placeholder="5"
                          value={formData.bedNumber}
                          onChange={handleNumericChange}
                        />
                        {errors.capacity && (
                          <div style={{ color: "red" }}>{errors.bedNumber}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Bed Type <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-control"
                          name="bedType"
                          value={formData.bedType}
                          onChange={handleChange}
                        >
                          <option value="">Select Bed Type</option>
                          {bedtypes.map((bedtype, index) => (
                            <option key={index} value={bedtype.id}>
                              {bedtype.name}
                            </option>
                          ))}
                        </select>
                        {errors.bedType && (
                          <div style={{ color: "red" }}>{errors.bedType}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Room Description <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <textarea
                          className="form-control"
                          name="roomDescription"
                          value={formData.roomDescription}
                          onChange={handleChange}
                          rows="2"
                        ></textarea>
                        {errors.roomDescription && (
                          <div style={{ color: "red" }}>
                            {errors.roomDescription}
                          </div>
                        )}
                      </div>
                    </div>

                    

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="">Select Status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {errors.status && (
                          <div style={{ color: "red" }}>{errors.status}</div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-9 offset-sm-3">
                        <button type="submit" className="btn btn-primary px-4">
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* END */}
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

export default RoomAdd;
