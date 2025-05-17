import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import axios from "/config/axiosConfig";
import "../../components/css/RoleList.css";

const CheckLogAPI = () => {
  const Loader = () => (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <span>Loading...</span>
    </div>
  );

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc");
  const [logContent, setLogContent] = useState("");
  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const apiUrl = "/public/getLogApiReport";

  const [contractAddress, setContractAddress] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const fetchApiLog = async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === "success") {
        setLogContent(response.data.data);
      } else {
        setError("Failed to fetch log content");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Correctly closed useEffect hook
  useEffect(() => {
    fetchApiLog();
  }, []);

  return (
    <>
      <Helmet>
        <title>Check API LOG FILE</title>
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
                <div className="breadcrumb-title pe-3">Transaction API </div>
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
                        Log Viewer
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              <div className="card radius-10">
                <div style={{ textAlign: "right" }}>
                  <button onClick={fetchApiLog}>Refresh</button>
                </div>
                {loading ? (
                  <Loader />
                ) : (
                  <div className="card-body">
                    <div
                      className="container-fluid"
                      style={{
                        height: "500px", // Define the height
                        overflowY: "scroll", // Enable vertical scrolling
                        border: "1px solid #ccc", // Optional: Add a border for clarity
                        padding: "10px", // Optional: Add some padding
                      }}
                    >
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {logContent}
                      </pre>
                    </div>
                  </div>
                )}
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

export default CheckLogAPI;
