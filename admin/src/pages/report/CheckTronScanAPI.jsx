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

const CheckTronScanAPI = () => {
  const [merchantdata, setMerchantData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDepositid, setSearchDepositIdQuery] = useState("");
  const [datevalue, filterDate] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [searchMerchant, setMerchant] = useState("");
  const [merchantId, setMerchantId] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc");

  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const apiUrl = "/public/getApiReport";

  const [contractAddress, setContractAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
        setLoading(true);
      const apiUrl = `https://api.trongrid.io/v1/accounts/${contractAddress}/transactions/trc20?limit=1&only_confirmed=true`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (data?.data?.length) {
        setTransactions(data.data);
      } else {
        setTransactions([]);
        alert("No transactions found for the provided contract address.");
      }
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally{

        setLoading(false);
    }
  };

  // Correctly closed useEffect hook
  useEffect(() => {
  
  }, []);

  return (
    <>
      <Helmet>
        <title>CheckTronScanAPI</title>
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
                <div className="breadcrumb-title pe-3">TRC20 </div>
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
                        Transactions
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="card radius-10">
                <div className="card-body">
                  <div className="container-fluid">
                    <div
                      style={{
                        padding: "20px",
                        maxWidth: "600px",
                        margin: "0 auto",
                      }}
                    >
                    
                      <div>
                        <input
                          type="text"
                          placeholder="Enter Contract Address"
                          value={contractAddress}
                          onChange={(e) => setContractAddress(e.target.value)}
                          style={{
                            padding: "10px",
                            width: "100%",
                            marginBottom: "10px",
                          }}
                        />
                        <button
                        className="w-100"
                          onClick={fetchTransactions}
                          style={{ padding: "10px 20px", cursor: "pointer" }}
                        >
                          Fetch Transactions
                        </button>
                      </div>
                      {error && <p style={{ color: "red" }}>Error: {error}</p>}
                      {transactions.length > 0 && (
                        <div style={{ marginTop: "20px" }}>
                          <h2>Last Transaction Details</h2>
                          {transactions.map((transaction, index) => {
                            const {
                              transaction_id: transactionId = "N/A",
                              from = "N/A",
                              to = "N/A",
                              value,
                              token_info: { decimals } = {},
                              block_timestamp: timestamp,
                            } = transaction;

                            const amount =
                              value && decimals
                                ? (value / Math.pow(10, decimals)).toFixed(2)
                                : "N/A";
                            const dateTime = timestamp
                              ? new Date(timestamp).toLocaleString()
                              : "N/A";

                            return (
                              <div
                                key={index}
                                style={{
                                  border: "1px solid #ccc",
                                  padding: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <p>
                                  <strong>Transaction ID:</strong>{" "}
                                  {transactionId}
                                </p>
                                <p>
                                  <strong>From:</strong> {from}
                                </p>
                                <p>
                                  <strong>To:</strong> {to}
                                </p>
                                <p>
                                  <strong>Amount:</strong> {amount} USDT
                                </p>
                                <p>
                                  <strong>Date and Time:</strong> {dateTime}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
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

export default CheckTronScanAPI;
