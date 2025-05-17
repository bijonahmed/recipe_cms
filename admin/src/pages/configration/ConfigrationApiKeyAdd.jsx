import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ConfigrationApiKeyAdd = () => {
  const [merchantdata, setMerchantData] = useState([]); // Populate this with actual data
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const [callback_domain, setcallback_domain] = useState("");

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const token = JSON.parse(sessionStorage.getItem("token"));

  const generateRandomKey = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const randomKey = Array.from({ length: 32 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
    setKey(randomKey);
  };

  const generatePassword = () => {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomPassword = Array.from({ length: 12 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
    setPassword(randomPassword);
  };

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

  const handleConfigStatus = (e) => {
    setStatus(e.target.value);
  };

  const handlecallback_domain = (e) => {
    setcallback_domain(e.target.value);
  };

  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const handleConfigRuleId = (e) => {
    const merchant = merchantdata.find(
      (m) => m.id === parseInt(e.target.value)
    );
    setSelectedMerchant(merchant);
    if (merchant) {
      setEmail(merchant.email);
      setPhone(merchant.phone);
    } else {
      setEmail("");
      setPhone("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form validation
    const newErrors = {};
    if (!selectedMerchant) newErrors.merchant = "Merchant is required.";
    if (!key) newErrors.key = "Key is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!status) newErrors.status = "Status is required.";

    try {
      const formData = {
        merchant_id: selectedMerchant?.id,
        key,
        password,
        status,
        callback_domain,
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
    navigate("/configration/config-api-key-list");
  };

  useEffect(() => {
    fetchMerchantData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Add Configration Api Key Add</title>
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
                <div className="breadcrumb-title pe-3">Configration</div>
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
                        {" "}
                        Api Key Add
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
              <form onSubmit={handleSubmit}>
                <div className="card radius-10">
                  <div className="card-body p-4">
                    <div className="row mb-3">
                      <label
                        htmlFor="input46"
                        className="col-sm-3 col-form-label"
                      >
                        Select Merchant
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          id="input46"
                          value={selectedMerchant?.id || ""}
                          onChange={handleConfigRuleId}
                        >
                          <option value="">Select Merchant</option>
                          {merchantdata.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.company_name} | {user.name} | {user.phone}
                            </option>
                          ))}
                        </select>
                        {errors.merchant_id && (
                          <div style={{ color: "red" }}>
                            {errors.merchant_id}
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedMerchant && (
                      <>
                        <div className="row mb-3">
                          <label
                            htmlFor="input42"
                            className="col-sm-3 col-form-label"
                          >
                            Email
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              id="input42"
                              value={email}
                              readOnly
                              disabled
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label
                            htmlFor="input42"
                            className="col-sm-3 col-form-label"
                          >
                            Phone
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              id="input42"
                              value={phone}
                              readOnly
                              disabled
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="card-body p-4">
                    <h4>Configuration API Key</h4>
                    <div className="row mb-3">
                      <label
                        htmlFor="input42"
                        className="col-sm-3 col-form-label"
                      >
                        Key
                      </label>
                      <div className="col-sm-9 d-flex align-items-center">
                        <input
                          type="text"
                          className="form-control me-2"
                          value={key}
                          readOnly
                        />

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={generateRandomKey}
                        >
                          Generate Key
                        </button>
                      </div>
                      <center>
                        {" "}
                        {errors.key && (
                          <div style={{ color: "red" }}>{errors.key}</div>
                        )}
                      </center>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input42"
                        className="col-sm-3 col-form-label"
                      >
                        Password
                      </label>
                      <div className="col-sm-9 d-flex align-items-center">
                        <input
                          type="text"
                          className="form-control me-2"
                          value={password}
                          readOnly
                        />

                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={generatePassword}
                        >
                          Generate Password
                        </button>
                      </div>
                      <center>
                        {errors.password && (
                          <div style={{ color: "red" }}>{errors.password}</div>
                        )}
                      </center>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input42"
                        className="col-sm-3 col-form-label"
                      >
                        Callback Domain Name
                      </label>
                      <div className="col-sm-9 d-flex align-items-center">
                        <input
                          type="text"
                          className="form-control me-2"
                          value={callback_domain}
                          onChange={handlecallback_domain}
                        />
                      </div>
                      <center>
                        {errors.callback_domain && (
                          <div style={{ color: "red" }}>
                            {errors.callback_domain}
                          </div>
                        )}
                      </center>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input46"
                        className="col-sm-3 col-form-label"
                      >
                        Status
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-select"
                          value={status}
                          onChange={handleConfigStatus}
                        >
                          <option value="">Select Status</option>
                          <option value="1">Open</option>
                          <option value="0">Close</option>
                        </select>
                        {errors.status && (
                          <div style={{ color: "red" }}>{errors.status}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    <div className="row">
                      <div className="col-sm-9 offset-sm-3">
                        <button type="submit" className="btn btn-primary px-4">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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

export default ConfigrationApiKeyAdd;
