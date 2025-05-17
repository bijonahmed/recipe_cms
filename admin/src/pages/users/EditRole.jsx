import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";


const EditRole = () => {

  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const { id } = useParams();


  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");


  const defaultFetch = async () => {
    try {
      const response = await axios.get(`/user/roleCheck`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: id },  // or simply { userId } using shorthand
      });
      const userData = response.data.data;
      //console.log("API response data:", userData.name); // Debugging: Check API response
      setName(userData.name || "");
      setStatus(userData.status === 1 || userData.status === 0 ? userData.status : "");

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleConfigName = (e) => {
    setName(e.target.value);
  };
  const handleConfigStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("status", status);
      const response = await axios.post("/user/saveRole", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      //console.log(response.data);
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
      setName("");
      setStatus("");
      setErrors({});
      //console.log(response.data.message);
      navigate("/user/role-list");
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
    navigate('/user/role-list');
  };


  useEffect(() => {
    defaultFetch();

  }, []);

  return (
    <>
      <Helmet>
        <title>Edit Role</title>
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
                <div className="breadcrumb-title pe-3">Rule</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item">
                        <Link to="/dashboard"><i className="bx bx-home-alt" /></Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">Edit New Rule</li>
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
                          <input
                            type="text"
                            className="form-control"
                            id="input42"
                            placeholder="Enter Name"
                            value={name}
                            onChange={handleConfigName}
                          />
                          {errors.name && (<div style={{ color: "red" }}>{errors.name[0]}</div>)}
                        </div>
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

export default EditRole;