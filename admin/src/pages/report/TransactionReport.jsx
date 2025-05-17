import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import Pagination from "../../components/Pagination";
import axios from "/config/axiosConfig";
import "../../components/css/RoleList.css";

const TransactionReport = () => {
  const [merchantdata, setMerchantData] = useState([]);
  const [data, setData] = useState([]);
  const [booking_id, setBookingId] = useState("");
  const [customer_id, setCustomer] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const apiUrl = "/report/filterBybookingReport";

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

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          //searchQuery,
          selectedFilter,
          customer_id,
          fromDate,
          toDate,
          booking_id,
        },
      });

      if (response.data) {
        setData(response.data);
       // setTotalPages(response.data.total_pages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the total deposit amount
  const totalDepositAmount = data.reduce(
    (sum, item) => sum + parseFloat(item.deposit_amount || 0),
    0
  );

  useEffect(() => {
    const today = new Date();
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - 20);

    // Format: YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    setToDate(formatDate(today));
    setFromDate(formatDate(priorDate));
  }, []);


  // Correctly closed useEffect hook
  useEffect(() => {
    fetchData();
    fetchMerchantData();
  }, [selectedFilter, customer_id,fromDate,toDate,booking_id]);

  return (
    <>
      <Helmet>
        <title>Transaction Report</title>
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
                <div className="breadcrumb-title pe-3">Transaction</div>
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
                        Report
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="card radius-10">
                <div className="card-body">
                  <div className="container-fluid">
                    <div className="search-pagination-container">
                      <div className="row align-items-center mb-3">
                        <div className="col-12 col-md-4 mb-2 mb-md-0">
                          <div className="searchbar">
                            <input
                              type="text"
                              placeholder="Search Booking ID..."
                              className="form-control"
                              value={booking_id}
                              onChange={(e) =>
                                setBookingId(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-4 mb-2 mb-md-0">
                        <select
                          style={{ height: "46px" }}
                          className="form-select"
                          value={customer_id}
                          onChange={(e) => setCustomer(e.target.value)} // ✅ This line is important
                          id="input46"
                        >
                  <option value="">All Customer</option>
                  {merchantdata.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} | {user.phone}
                    </option>
                  ))}
                </select>
                        </div>

                        <div className="col-12 col-md-4 mb-2 mb-md-0">
                          <select
                            style={{ height: "46px" }}
                            className="form-select"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                          >
                            <option value="">All Booking Status</option>
                            <option value="1">Booking</option>
                            <option value="2">Release</option>
                            <option value="3">Cancel</option>
                          </select>
                        </div>

                        {/* From Date */}
                        <div className="col-12 col-md-4 mb-2 mb-md-0 mt-3">
                          <div className="searchbar">
                            <input
                              type="date"
                              className="form-control"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* To Date */}
                        <div className="col-12 col-md-4 mb-2 mb-md-0 mt-3">
                          <div className="searchbar">
                            <input
                              type="date"
                              className="form-control"
                              value={toDate}
                              onChange={(e) => setToDate(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-4 mb-2 mb-md-0 mt-3">
                          <div className="searchbar">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={fetchData}
                            >
                              Filter
                            </button>
                          </div>
                        </div>
                      </div>

                      {loading ? (
                        <div className="d-flex justify-content-center mt-3">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table align-middle mb-0 table-hover">
                            <thead className="table-light">
                              <tr>
                                <th className="text-left">BookingID</th>
                                <th className="text-left">Booking By</th>
                                <th className="text-left">Check In/Out</th>
                                <th className="text-center">Room Price</th>
                                <th className="text-center">Bed Info</th>
                                <th className="text-center">Payment Type</th>
                                <th className="text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.length > 0 ? (
                                data.map((item) => (
                                  <tr key={item.id}>
                                    <td>{item.booking_id}</td>
                                    <td className="text-left">{item.name}-[{item.customer_id}]</td>
                                    <td className="text-left">{item.checkin}---{item.checkout}</td>
                                    <td className="text-center">{item.room_price} BDT</td>
                                    <td className="text-center">{item.bed_name}</td>
                                    <td className="text-center">{item.paymenttype == 1 ? 'Online' : item.paymenttype == 2 ? 'Offline' : ''}</td>
                                    <td className="text-center">
                                        <span
                                          className={`badge ${
                                            item.booking_status == 1
                                              ? "bg-gradient-quepal"
                                              : item.booking_status == 2
                                              ? "bg-gradient-bloody"
                                               : item.booking_status == 3
                                              ? "bg-gradient-bloody"
                                              : ""
                                          } text-white shadow-sm w-100`}
                                        >
                                          {item.booking_status == 1
                                            ? "Booking"
                                            : item.booking_status == 2
                                            ? "Release"
                                            : item.booking_status == 3
                                            ? "Cancel"
                                            : ""}
                                        </span>
                                    </td>
                                   
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="9" className="text-center">
                                    No data found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="text-end mt-3">
                        <p className="fw-bold"> Total Amount: {data.reduce((sum, item) => sum + Number(item.room_price), 0).toLocaleString()} BDT</p>
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

export default TransactionReport;
