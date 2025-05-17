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

const SuperAdminList = () => {

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(1);

  const [searchEmail, setFilterEmail] = useState("");
  const [searchUsername, setFilterUsername] = useState("");


  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc");
  const merchant_rule = 1; 

  const apiUrl = "/user/allUsers";

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleEmailChange = (e) => {
    setFilterEmail(e.target.value); 
  };
  

  const handleUsernameChange = (e) => {
    setFilterUsername(e.target.value); // Update state with the input value
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
          searchEmail,
          searchUsername,
          page: currentPage,
          rule_id: 1,
          merchant_rule,
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
    navigate("/user/user-add-supperadmin");
  };

  const handleEdit = (id) => {
    navigate(`/user/user-edit/${id}`);
  };


  // Correctly closed useEffect hook
  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedFilter, searchEmail, searchUsername, currentPage, pageSize]);

  return (
    <>
      <Helmet>
        <title>SuperAdmin List</title>
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
                <div className="breadcrumb-title pe-3">Super Admin</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item">
                        <Link to="/dashboard">
                          <i className="bx bx-home-alt" />
                        </Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
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
                              placeholder="Search name..."
                              className="form-control"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>


                        <div className="col-12 col-md-2 mb-2 mb-md-0">
                          <div className="searchbar">
                            <input
                              type="text"
                              placeholder="Search email..."
                              className="form-control"
                              value={searchEmail}
                              onChange={handleEmailChange}
                              
                            />
                          </div>
                        </div>


                        <div className="col-12 col-md-2 mb-2 mb-md-0">
                          <div className="searchbar">
                            <input
                              type="text"
                              placeholder="Search username..."
                              className="form-control"
                              value={searchUsername}
                              onChange={handleUsernameChange}
                            />
                          </div>
                        </div>


                        <div className="col-12 col-md-1 mb-2 mb-md-0">
                          <div className="searchbar">
                            <select
                              className="form-select"
                              value={pageSize}
                              onChange={handlePageSizeChange}>
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
                            onChange={(e) => setSelectedFilter(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={fetchData}>
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
                                <th className="text-center"
                                  onClick={handleSort}
                                  style={{ cursor: "pointer" }}>
                                  Name
                                  {sortOrder === "asc" ? (
                                    <span
                                      style={{ marginLeft: "5px", fontSize: "14px", }}>
                                      ↑
                                    </span>
                                  ) : (
                                    <span
                                      style={{ marginLeft: "5px", fontSize: "14px", }}>
                                      ↓
                                    </span>
                                  )}
                                </th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Phone Number</th>
                                <th className="text-center">Username</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Created Time</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.length > 0 ? (
                                data.map((item) => (
                                  <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td className="text-left">{item.email}</td>
                                    <td className="text-center">{item.phone}</td>
                                    <td className="text-left">{item.username}</td>
                                    <td className="text-center">{item.status}</td>
                                    <td className="text-center">{item.created_at}</td>
                                    <td className="text-center"><a href="#" onClick={() => handleEdit(item.id)}><i className="lni lni-pencil-alt"></i></a></td>

                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="9"
                                    className="text-center">
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

export default SuperAdminList;
