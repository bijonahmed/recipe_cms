import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const RoomFacilitiesEdit = () => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const { id } = useParams();
  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const [roomsize, setRoomSize] = useState([]);
  const [facilitiesList, setFacilitiesList] = useState([]);
  const [facilities, setRoomfacilities] = useState([]);
  const [facilitiesData, setSelectedFacilitiesData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [formData, setFormData] = useState({
    room_id: id,
    roomType: "",
    room_facility_group_id: "",
    status: "1", // Default value
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    //console.log(`Field: ${name}, Selected Value: ${value}`);
    if (name == "room_facility_group_id") {
      try {
        const response = await axios.get(`/roomfacility/checkFacilities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { room_facility_group_id: value }, // or simply { userId } using shorthand
        });
        const userData = response.data || [];
        //console.log("UserData:" + userData);
        setFacilitiesList(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  const getRoomfacilities = async () => {
    try {
      const response = await axios.get(`/roomfacility/getsFacilityGruop`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      //console.log("API response data:", data); // Debugging: Check API response
      setRoomfacilities(data);
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

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      Swal.fire("Warning", "No facilities selected!", "warning");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Selected facilities will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete selected!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `/roomsetting/deleteSelectedFacilities`,
            { ids: selectedIds }, // Send selected IDs in request body
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire(
            "Deleted!",
            "Selected facilities have been deleted.",
            "success"
          );

          // Refresh the facility list after deletion
          setSelectedIds([]); // Clear selected checkboxes
          checkSelectedFacilities();
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
          console.error("Error deleting facilities:", error);
        }
      }
    });
  };

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

  //END

  const handleSubmit = async (formData) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formPayload = new FormData();
      formPayload.append("room_id", formData.id);
      formPayload.append(
        "room_facility_group_id",
        formData.room_facility_group_id
      );
      formPayload.append("status", formData.status);
      const response = await axios.post(
        "/roomsetting/roomFacilitiesSave",
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Your data has been successful saved.",
      });

      checkSelectedFacilities();

      //  setFormData({}); // Reset form data
      //   navigate(`/roomsetting/room-facilities-edit/${id}`);
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
    defaultFetch();
    getRoomfacilities();
    checkSelectedFacilities();
  }, []);

  return (
    <>
      <Helmet>
        <title>Room Facilities</title>
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
                <div className="breadcrumb-title pe-3">Room Facilities</div>
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
                        Room Facilities
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

              <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12">
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
                              disabled
                              readOnly
                              className="form-control"
                              name="roomType"
                              value={formData.roomType}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <label className="col-sm-3 col-form-label fw-bold">
                            Room Facilities{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-sm-9">
                            <div className="d-flex align-items-center gap-2">
                              <select
                                className="form-select border rounded"
                                name="room_facility_group_id"
                                value={formData.room_facility_group_id}
                                onChange={handleChange}
                              >
                                <option value="">
                                  Select Room Facilities Group
                                </option>
                                {facilities.map((facility, index) => (
                                  <option key={index} value={facility.id}>
                                    {facility.name}
                                  </option>
                                ))}
                              </select>

                              <button
                                className="btn btn-outline-primary"
                                type="submit"
                              >
                                <i className="lni lni-plus"></i>
                              </button>
                            </div>

                            {/* Validation Error Message */}
                            {errors.room_facility_group_id && (
                              <div className="text-danger mt-1">
                                {errors.room_facility_group_id}
                              </div>
                            )}

                            {/* Displaying Selected Facilities */}

                            {facilitiesList && facilitiesList.length > 0 ? (
                              <div className="mt-2 p-2 border rounded bg-light">
                                <strong>Facilities:</strong>
                                <div className="d-flex flex-wrap gap-2 mt-1">
                                  {facilitiesList.map((data, index) => (
                                    <span
                                      key={index}
                                      className="badge bg-primary text-white p-2 rounded"
                                      style={{ fontSize: "16px" }}
                                    >
                                      <i className="lni lni-checkmark-circle me-1"></i>{" "}
                                      {data.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted mt-2">
                                No facilities selected.
                              </p>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* END */}
                  </div>
                </div>

                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="card radius-10">
                    <div className="card-body p-4">
                      <div align="right">
                        <button
                          className="btn btn-danger mb-3"
                          onClick={handleBulkDelete}
                          disabled={selectedIds.length === 0}
                        >
                          Delete Selected
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>
                                <input
                                  type="checkbox"
                                  onChange={(e) => {
                                    setSelectedIds(
                                      e.target.checked
                                        ? facilitiesData.map((d) => d.id)
                                        : []
                                    );
                                  }}
                                  checked={
                                    selectedIds.length ===
                                      facilitiesData.length &&
                                    facilitiesData.length > 0
                                  }
                                />
                              </th>
                              <th>Group Name</th>
                              <th>Facilities Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {facilitiesData.length > 0 ? (
                              facilitiesData.reduce(
                                (acc, data, index, array) => {
                                  const isFirstOccurrence =
                                    index === 0 ||
                                    data.facility_group_name !==
                                      array[index - 1].facility_group_name;

                                  acc.push(
                                    <tr key={data.id}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={selectedIds.includes(
                                            data.id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(data.id)
                                          }
                                        />
                                      </td>

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
                                          <strong>
                                            {data.facility_group_name}
                                          </strong>
                                        </td>
                                      ) : null}

                                      <td>{data.facilities_name}</td>
                                    </tr>
                                  );

                                  return acc;
                                },
                                []
                              )
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

export default RoomFacilitiesEdit;
