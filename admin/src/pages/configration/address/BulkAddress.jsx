import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../../components/Navbar.jsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import LeftSideBarComponent from "../../../components/LeftSideBarComponent";

import "../../../components/css/BulkAddress.css";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";

const BulkAddress = () => {
  const [merchantdata, setMerchantData] = useState([]); // Populate this with actual data
  const [showBulkAddress, setMerchantBulkAddress] = useState([]); // Populate this with actual data
  const [errors, setErrors] = useState({});
  const [merchant_id, setMerchantId] = useState("");
  const [companyname, setMerchantCompanyName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
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

  const getBulkAddress = async () => {
    try {
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(`/user/getBulkAddressMerchant`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id },
      });
      if (response.data) {
        setMerchantBulkAddress(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const defaultFetch = async () => {
    try {
      const response = await axios.get(`/user/findMerchantDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { id: id }, // or simply { userId } using shorthand
      });
      const userData = response.data;
      //console.log("API response data:", userData.name); // Debugging: Check API response
      setMerchantId(userData.merchant_id || "");
      setMerchantCompanyName(userData.company_name || "");
      setName(userData.name || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const deleteWalletAddress = async (walletId, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.get(`/user/deleteWallet`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            params: {
              id: walletId,
              status: status,
            },
          });

          Swal.fire("Deleted!", "The wallet has been deleted.", "success");
          getBulkAddress(); // Refresh the list
        } catch (error) {
          console.error("Error deleting wallet:", error);
          Swal.fire("Error!", "Failed to delete the wallet.", "error");
        }
      }
    });
  };

  const handleConfigMerchant = (e) => {
    setMerchantId(e.target.value);
  };
  const handleConfigStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleConfigWalletAddress = (e) => {
    setWalletAddress(e.target.value);
  };

  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Define allowed file extensions
    const allowedExtensions = /(\.xlsx|\.xls|\.csv)$/i;

    // Check if the file matches the allowed extensions
    if (selectedFile && allowedExtensions.exec(selectedFile.name)) {
      setFile(selectedFile); // Set the file if valid
    } else {
      alert("Please upload a valid file (.xlsx, .xls, .csv only).");
      event.target.value = ""; // Reset the file input
    }
  };

  const handleSubmitExcel = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "/user/upload-excel-bulk-address",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //alert(response.data.message || "File uploaded successfully!");

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
      getBulkAddress();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        id,
        walletAddress,
        status,
      };

      const response = await axios.post(
        "/setting/saveMerchantBulkAddress",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
      getBulkAddress();
      // Reset form fields and errors
      setStatus("");
      setErrors({});
      //console.log(response.data.message);
      navigate(`/configration/address/merchant-address/${slug}`);
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
    getBulkAddress();
    fetchMerchantData();
    defaultFetch();
  }, []);

  return (
    <>
      <Helmet>
        <title>Merchant Details </title>
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
                        <Link to="/dashboard">
                          <i className="bx bx-home-alt" />
                        </Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {companyname} ({name})
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
                <div className="col-6">
                  <div className="card radius-10">
                    <div className="card-body">
                      <div className="container-fluid">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <label
                              htmlFor="input42"
                              className="col-sm-3 col-form-label"
                            >
                              Name
                            </label>
                            <div className="col-sm-9">
                              <div className="position-relative">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="input42"
                                  value={companyname}
                                  readOnly
                                  disabled
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="input42"
                              className="col-sm-3 col-form-label"
                            >
                              Wallet Address
                            </label>
                            <div className="col-sm-9">
                              <div className="position-relative">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="input42"
                                  value={walletAddress}
                                  autoFocus
                                  autoComplete="off"
                                  onChange={handleConfigWalletAddress}
                                />
                              </div>
                            </div>
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
                                id="input46"
                                value={status}
                                onChange={handleConfigStatus}
                              >
                                <option value="">Select Status</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                              {errors.status && (
                                <div style={{ color: "red" }}>
                                  {errors.status[0]}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <label className="col-sm-3 col-form-label" />
                            <div className="col-sm-9">
                              <div className="d-md-flex d-grid align-items-center gap-3">
                                <button
                                  type="submit"
                                  className="btn btn-primary px-4 w-100"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* Bulk upload */}
                  <div className="card radius-10">
                    <div className="card-body">
                      <div className="container-fluid">
                        <span>
                          Download{" "}
                          <a href="/assets/downloadFormat.xlsx">upload</a>{" "}
                          format{" "}
                        </span>
                        <hr />
                        <form
                          onSubmit={handleSubmitExcel}
                          encType="multipart/form-data"
                        >
                          <div className="row mb-3">
                            <label
                              htmlFor="input42"
                              className="col-sm-3 col-form-label"
                            >
                              Name
                            </label>
                            <div className="col-sm-9">
                              <div className="position-relative">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="input42"
                                  value={companyname}
                                  readOnly
                                  disabled
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label
                              htmlFor="input42"
                              className="col-sm-3 col-form-label"
                            >
                              File upload
                            </label>
                            <div className="col-sm-9">
                              <div className="position-relative">
                                <input
                                  type="file"
                                  id="file"
                                  accept=".xlsx,.xls,.csv"
                                  onChange={handleFileChange}
                                  required
                                />
                              </div>
                            </div>
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
                                id="input46"
                                value={status}
                                onChange={handleConfigStatus}
                              >
                                <option value="">Select Status</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                              {errors.status && (
                                <div style={{ color: "red" }}>
                                  {errors.status[0]}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <label className="col-sm-3 col-form-label" />
                            <div className="col-sm-9">
                              <div className="d-md-flex d-grid align-items-center gap-3">
                                <button
                                  type="submit"
                                  className="btn btn-primary px-4 w-100"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="card radius-10">
                    <div className="card-body">
                      <div className="container-fluid">
                        <center>
                          Total Number of Wallet Address (
                          {showBulkAddress ? showBulkAddress.length : 0})
                        </center>
                        <br />
                        <div className="table-responsive">
                          <div
                            style={{
                              maxHeight: "300px", // Adjust the height as needed
                              overflowY: "auto", // Enable vertical scrolling
                              border: "1px solid #ddd", // Optional: Adds a border to the scrollable area
                            }}
                          >
                            <table
                              className="table table-bordered table-hover table-sm"
                              style={{ fontSize: "12px" }}
                            >
                              <thead className="thead-dark">
                                <tr>
                                  <th>SL</th>
                                  <th>Wallet Address</th>
                                  <th className="text-center">Status</th>
                                  <th className="text-center">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {showBulkAddress &&
                                showBulkAddress.length > 0 ? (
                                  showBulkAddress.map((item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{item.walletAddress}</td>
                                      <td
                                        className="text-center"
                                        onClick={() =>
                                          item.status == 1
                                            ? deleteWalletAddress(item.id, 1)
                                            : deleteWalletAddress(item.id, 1)
                                        }
                                        style={{
                                          backgroundColor:
                                            item.status == 1 ? "green" : "red",
                                          color: "white", // Ensures text contrast
                                        }}
                                      >
                                        {item.status == 1
                                          ? "Active"
                                          : "Inactive"}
                                      </td>
                                      <td
                                        onClick={() =>
                                          deleteWalletAddress(item.id, 0)
                                        }
                                      >
                                        <center>
                                          <a href="#">
                                            <i className="fa-solid fa-trash"></i>
                                          </a>
                                        </center>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="2" className="text-center">
                                      No data available.
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

export default BulkAddress;
