import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const ConfigrationApiKeyEdit = () => {

  const [merchantdata, setMerchantData] = useState([]); // Populate this with actual data
  const [errors, setErrors] = useState({});
  const [merchant_id, setMerchantId] = useState("");
  const [status, setStatus] = useState(1);
  const [callback_domain, setcallback_domain] = useState("");
  const { id } = useParams();

  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");

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
  const defaultFetch = async () => {
    try {
      const response = await axios.get(`/user/findUserDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id },  // or simply { userId } using shorthand
      });
      const userData = response.data;
      //console.log("API response data:", userData.name); // Debugging: Check API response
      setMerchantId(userData.merchant_id || "");
      setcallback_domain(userData.callback_domain || "");
      setStatus(userData.status === 1 || userData.status === 0 ? userData.status : "");

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handlecallback_domain = (e) => {
    setcallback_domain(e.target.value);
  };
  const handleConfigMerchant = (e) => {
    setMerchantId(e.target.value);
  };
  const handleConfigStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        id,
        merchant_id,
        status,
        callback_domain

      };

      const response = await axios.post("/setting/saveAPIKey", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
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
      setStatus("");
      setErrors({});
      //console.log(response.data.message);
      navigate("/configration/config-api-key-list");
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
    navigate('/configration/config-api-key-list');
  };

  useEffect(() => {
    fetchMerchantData();
    defaultFetch();

  }, []);

  return (
    <>
      <Helmet>
        <title>Edit Merchant </title>
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
                <div className="breadcrumb-title pe-3">Merchant</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item">
                        <Link to="/dashboard"><i className="bx bx-home-alt" /></Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">Edit</li>
                    </ol>
                  </nav>
                </div>
                <div className="ms-auto">
                  <button type="button" className="btn btn-black" onClick={handleAddNewClick}>Back</button>
                </div>
              </div>

              <div className="card radius-10">

                {/* Start */}
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <label htmlFor="input42" className="col-sm-3 col-form-label">Name</label>
                      <div className="col-sm-9">
                        <div className="position-relative">
                          <select
                          disabled
                            className="form-select"
                            id="input46"
                            value={merchant_id}
                            onChange={handleConfigMerchant}>
                            <option value="">Select Merchant</option>
                            {merchantdata.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.company_name} | {user.name} | {user.phone}
                              </option>
                            ))}
                          </select>
                          {errors.merchant_id && <div style={{ color: "red" }}>{errors.merchant_id}</div>}

                        </div>
                      </div>
                    </div>


                    <div className="row mb-3">
                      <label htmlFor="input46" className="col-sm-3 col-form-label">Callback Domain</label>
                      <div className="col-sm-9">
                      <input
                          type="text"
                          className="form-control me-2"
                          value={callback_domain}
                          onChange={handlecallback_domain}
                        />
                       {errors.callback_domain && (
                          <div style={{ color: "red" }}>
                            {errors.callback_domain}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label htmlFor="input46" className="col-sm-3 col-form-label">Status</label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          id="input46"
                          value={status}
                          onChange={handleConfigStatus}>
                          <option value="">Select Status</option>
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                        {errors.status && (<div style={{ color: "red" }}>{errors.status[0]}</div>)}
                      </div>
                    </div>

                    <div className="row">
                      <label className="col-sm-3 col-form-label" />
                      <div className="col-sm-9">
                        <div className="d-md-flex d-grid align-items-center gap-3">
                          <button type="submit" className="btn btn-primary px-4">Submit</button>

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
          <Link to="#" className="back-to-top"><i className="bx bxs-up-arrow-alt" /></Link>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ConfigrationApiKeyEdit;