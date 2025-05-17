import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const PromoCodeEdit = () => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const { id } = useParams();
  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const [roomtype, setRoomTypes] = useState([]);


  const [formData, setFormData] = useState({
    id:"",
    room_id: "",
    form_date: "",
    to_date: "",
    discount: "",
    promoCode: "",
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



  const getRoomType = async () => {
    try {
      const response = await axios.get(`/roomsetting/getsRoomTypes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      //console.log("API response data:", data); // Debugging: Check API response
      setRoomTypes(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };



  const defaultFetch = async () => {
    try {
      const response = await axios.get(`/roomsetting/checkPromoCodeRow`, {
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

  const handleSubmit = async (formData) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formPayload = new FormData();
      formPayload.append("id", formData.id);
      formPayload.append("room_id", formData.room_id);
      formPayload.append("form_date", formData.form_date);
      formPayload.append("to_date", formData.to_date);
      formPayload.append("discount", formData.discount);
      formPayload.append("promoCode", formData.promoCode);
      formPayload.append("status", formData.status);
      const response = await axios.post("/roomsetting/promoCodeSave", formPayload, {
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
      navigate("/roomsetting/promocode-list");
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
    navigate("/roomsetting/promocode-list");
  };

  useEffect(() => {
    defaultFetch();
    getRoomType();
  }, []);

  return (
    <>
      <Helmet>
        <title>Edit PromoCode</title>
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
                <div className="breadcrumb-title pe-3">Edit PromoCode</div>
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
                        Edit Promo Code
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
                        <select
                          className="form-control"
                          name="room_id"
                          value={formData.room_id}
                          onChange={handleChange}
                        >
                          <option value="">Select Room Type</option>
                          {roomtype.map((size, index) => (
                            <option key={index} value={size.id}>
                              {size.name}
                            </option>
                          ))}
                        </select>
                        {errors.room_id && (
                          <div style={{ color: "red" }}>
                            {errors.room_id}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Form<span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="date"
                          className="form-control"
                          name="form_date"
                          value={formData.form_date}
                          onChange={handleChange}
                        />
                        {errors.form_date && (
                          <div style={{ color: "red" }}>{errors.form_date}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">To</label>
                      <div className="col-sm-9">
                        <input
                          type="date"
                          className="form-control"
                          name="to_date"
                          value={formData.to_date}
                          onChange={handleChange}
                        />
                        {errors.to_date && (
                          <div style={{ color: "red" }}>
                            {errors.to_date}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Discount <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="discount"
                          placeholder="0"
                          value={formData.discount}
                          onChange={handleNumericChange}
                        />
                        {errors.discount && (
                          <div style={{ color: "red" }}>{errors.discount}</div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label className="col-sm-3 col-form-label">
                        Promo Code <span className="text-danger">*</span>
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="promoCode"
                          placeholder="0"
                          value={formData.promoCode}
                          onChange={handleChange}
                        />
                        {errors.promoCode && (
                          <div style={{ color: "red" }}>{errors.promoCode}</div>
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

export default PromoCodeEdit;
