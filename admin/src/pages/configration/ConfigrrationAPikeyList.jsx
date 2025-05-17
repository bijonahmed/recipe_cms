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

const ConfigrrationWalletList = () => {

  const [merchantdata, setMerchantData] = useState([]);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchMerchant, setMerchant] = useState("");
  const [merchantId, setMerchantId] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc");

  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const apiUrl = "/setting/searchByConfigrationApiKey";




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
          searchQuery,
          selectedFilter,
          searchMerchant,
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

  const handleMerchant = (e) => {
    setMerchant(Number(e.target.value));
  };


  const handleAddNewClick = () => {
    navigate("/configration/config-api-key-add");
  };

  const handleEdit = (id) => {
    navigate(`/configration/config-api-key-edit/${id}`);
  };

 const makeBulkAddress = (id) => {
  setMerchantId(id);
  navigate(`/configration/address/merchant-address/${id}`);
   
  };

  
  // Correctly closed useEffect hook
  useEffect(() => {
    fetchData();
    fetchMerchantData();
  }, [searchQuery, selectedFilter, searchMerchant, currentPage, pageSize]);

  return (
    <>
      <Helmet>
        <title>API Configration List</title>
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
                <div className="breadcrumb-title pe-3">API Configration </div>
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
                    onClick={handleAddNewClick}>
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
                              placeholder="Search api key..."
                              className="form-control"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>


                        <div className="col-12 col-md-3 mb-2 mb-md-0">
                          <select
                            className="form-select"
                            value={searchMerchant}
                            onChange={handleMerchant}
                            id="input46">
                            <option value="">All Merchant</option>
                            {merchantdata.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.company_name} | {user.name} | {user.phone}
                              </option>
                            ))}
                          </select>
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
                                  Merchant Name
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

                                <th className="text-center">API Key</th>
                                <th className="text-center">Password</th>
                                <th className="text-center">Callback Domain</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Created</th>
                                <th className="text-center">Action</th>
                                <th className="text-center">Wallet</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.length > 0 ? (
                                data.map((item) => (
                                  <tr key={item.id}>
                                    <td><small>{item.company_name}({item.name})</small></td>
                                    <td><small>{item.key}</small></td>
                                    <td><small>{item.password}</small></td>
                                    <td className="text-center"><small>{item.callback_domain}</small></td>
                                    <td className="text-center"><small>{item.status}</small></td>
                                    <td className="text-center"><small>{item.created_at}</small></td>
                                    <td className="text-center"><a href="#" onClick={() => handleEdit(item.id)}><small><i className="lni lni-pencil-alt"></i>&nbsp;Edit</small></a>
                                    </td>
                                    <td className="text-center" onClick={() => makeBulkAddress(item.merchant_id)}><small><button className="btn-primary btn-sm"><i className="fa-solid fa-circle-check"></i></button><br/>&nbsp;Create wallet ({item.countBulkAdd})</small>
                                    </td>
                                    
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

export default ConfigrrationWalletList;
