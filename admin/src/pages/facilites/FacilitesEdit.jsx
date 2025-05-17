import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const FacilitesEdit = () => {
  const [facility, setFaciityGruop] = useState([]);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const { id } = useParams();
  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");

    const [formData, setFormData] = useState({
      room_facility_group_id: "",
      name: "",
      status: 1,
    });
  

    const handleFormSubmit = (e) => {
      e.preventDefault();
      handleSubmit(formData);
    };

     // Handle input change
 const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};


  const defaultFetch = async () => {
    try {
      const response = await axios.get(`/roomfacility/checkRoomFacilityRow`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // or simply { userId } using shorthand
      });
      const userData = response.data;
      //console.log("API response data:", userData); // Debugging: Check API response
      setFormData((prev) => ({
        ...prev,
        ...userData,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleConfigName = (e) => {
    setName(e.target.value);
  };
  const handleConfigStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (formData) => {
      
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const formPayload = new FormData();
        formPayload.append("id", formData.id);
        formPayload.append("room_facility_group_id", formData.room_facility_group_id);
        formPayload.append("name", formData.name);
        formPayload.append("status", formData.status);
        const response = await axios.post("/roomfacility/roomFacilitySave", formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        //console.log(response.data);
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
  
        // Reset form fields and errors
        setName("");
        setStatus("");
        setErrors({});
        //console.log(response.data.message);
        navigate("/facilites/facilites-list");
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

  const navigate = useNavigate();
  const handleAddNewClick = () => {
    navigate("/facilites/facilites-list");
  };

    const facilityGroup = async () => {
      try {
        const response = await axios.get(`/roomfacility/getsFacilityGruop`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        //console.log("API response data:", data); // Debugging: Check API response
        setFaciityGruop(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

  useEffect(() => {
    defaultFetch();
    facilityGroup();
  }, []);

  return (
    <>
      <Helmet>
        <title>Facilites Edit</title>
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
                <div className="breadcrumb-title pe-3">Facilites Edit</div>
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
                    Facilites Edit
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
                      <label
                        htmlFor="input42"
                        className="col-sm-3 col-form-label"
                      >
                        Facility Gruop <span className="text-danger">*</span>{" "}
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-control"
                          name="room_facility_group_id"
                          value={formData.room_facility_group_id}
                          onChange={handleChange}
                        >
                          <option value="">Select Facility Gruop</option>
                          {facility.map((group, index) => (
                            <option key={index} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                        {errors.room_facility_group_id && (
                          <div style={{ color: "red" }}>
                            {errors.room_facility_group_id}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input42"
                        className="col-sm-3 col-form-label"
                      >
                        Name <span className="text-danger">*</span>{" "}
                      </label>
                      <div className="col-sm-9">
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                          {errors.name && (
                            <div style={{ color: "red" }}>{errors.name[0]}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input46"
                        className="col-sm-3 col-form-label"
                      >
                        Status <span className="text-danger">*</span>{" "}
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="">Select Status</option>
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                        {errors.status && (
                          <div style={{ color: "red" }}>{errors.status[0]}</div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <label className="col-sm-3 col-form-label" />
                      <div className="col-sm-9">
                        <div className="d-md-flex d-grid align-items-center gap-3">
                          <button
                            type="submit"
                            className="btn btn-primary px-4"
                          >
                            Submit
                          </button>
                        </div>
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

export default FacilitesEdit;