import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import Pagination from "../../components/Pagination";
import axios from "/config/axiosConfig";

const PromocodeList = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc");

  const apiUrl = "/roomsetting/promocodeList";
  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      if (a.roomType.toLowerCase() < b.roomType.toLowerCase()) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (a.roomType.toLowerCase() > b.roomType.toLowerCase()) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const rawToken = sessionStorage.getItem("token");
      const token = rawToken?.replace(/^"(.*)"$/, "$1");

      if (!token) {
        throw new Error("Token not found in sessionStorage");
      }
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          searchQuery,
          selectedFilter,
          page: currentPage,
          pageSize,
        },
      });

      if (response.data.data) {
        setData(response.data.data);
        setTotalPages(response.data.total_pages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleAddNewClick = () => {
    navigate("/roomsetting/promocode-add");
  };

  const handleEdit = (id) => {
    navigate(`/roomsetting/promocode-edit/${id}`);
  };

  // Correctly closed useEffect hook
  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedFilter, currentPage, pageSize]);

  return (
    <>
      <Helmet>
        <title>Promocode List</title>
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
                <div className="breadcrumb-title pe-3">Promocode List</div>
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
                        List
                      </li>
                    </ol>
                  </nav>
                </div>

                <div className="ms-auto">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddNewClick}
                  >
                    Add New
                  </button>
                </div>
              </div>

              <div className="card radius-10">
                <div className="card-body">
                  <div className="container-fluid">
                    <div className="search-pagination-container">
                      <div className="row align-items-center mb-3">
                        <div className="col-12 col-md-5 mb-2 mb-md-0">
                          <div className="searchbar">
                            <input
                              type="text"
                              placeholder="Search Promo Code..."
                              className="form-control"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-1 mb-2 mb-md-0">
                          <div className="searchbar">
                            <select
                              className="form-select"
                              value={pageSize}
                              onChange={handlePageSizeChange}
                            >
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="50">50</option>
                              <option value="100">100</option>
                              <option value="200">200</option>
                              <option value="300">300</option>
                              <option value="400">400</option>
                              <option value="500">500</option>
                              <option value="600">600</option>
                              <option value="700">700</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-md-2 d-flex justify-content-between align-items-center gap-2">
                          <select
                            className="form-select"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                          >
                            <option value="">All Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={fetchData}
                          >
                            Apply
                          </button>
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
                          <table className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <td>ID</td>
                                <th
                                  className="text-center"
                                  onClick={handleSort}
                                  style={{ cursor: "pointer" }}
                                >
                                  Room Type
                                  {sortOrder === "asc" ? (
                                    <span
                                      style={{
                                        marginLeft: "5px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      ↑
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        marginLeft: "5px",
                                        fontSize: "14px",
                                      }}
                                    >
                                      ↓
                                    </span>
                                  )}
                                </th>
                                {/* <td>Room Type</td> */}
                                <td className="text-center">From Date</td>
                                <td className="text-center">To Date</td>
                                <td className="text-center">Promo Code</td>
                                <td className="text-center">Discount</td>
                                <td className="text-center">Promo Status</td>
                                <th className="text-center">Status</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.length > 0 ? (
                                data.map((item) => (
                                  <tr key={item.id}>
                                    <td className="text-center">{item.id}</td>
                                    <td>{item.roomType}</td>
                                    {/* <td>{item.roomType}</td> */}
                                    <td className="text-center">
                                      {item.form_date}
                                    </td>
                                    <td className="text-center">
                                      {item.to_date}
                                    </td>
                                    <td className="text-center">
                                      {item.promoCode}
                                    </td>

                                    <td className="text-center">
                                      {item.discount}
                                    </td>
                                    <td
                                      className={`text-center text-white p-2 ${
                                        item.prostatus === "Expired"
                                          ? "bg-danger"
                                          : "bg-primary"
                                      }`}
                                    >
                                      {item.prostatus}
                                    </td>
                                    <td className="text-center">
                                      {" "}
                                      {item.status}
                                    </td>
                                    <td className="text-center">
                                      <a
                                        href="#"
                                        onClick={() => handleEdit(item.id)}
                                      >
                                        <i className="lni lni-pencil-alt"></i>
                                      </a>
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

                      <div className="d-flex justify-content-center mt-3 gap-1">
                        <Pagination
                          totalPages={totalPages}
                          apiUrl={apiUrl}
                          onPageChange={handlePageChange}
                        />
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

export default PromocodeList;
