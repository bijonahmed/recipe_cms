import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../../components/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import LeftSideBarComponent from "../../components/LeftSideBarComponent";
import axios from "/config/axiosConfig";
import Swal from "sweetalert2";
import EditorComponent from "../../components/EditorComponent";

const PostEdit = () => {

    const [errors, setErrors] = useState({});
    const [name, setName] = useState("");
    const [post_category_id, setPostCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [categoryData, setCategoryData] = useState([]);
    const token = JSON.parse(sessionStorage.getItem("token"));
    const apiUrl = "/post/getPostrow";
    const { id } = useParams();

    const defaultFetch = async () => {
        try {
            const response = await axios.get(`/category/getPostCategory`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            //const userData = response.data;
            if (response.data) {
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };



    const PostDefaultFetch = async () => {
        try {
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { postId: id },  // or simply { userId } using shorthand
          });
          const userData = response.data.data;
          
            setName(userData.name || "");
            setPostCategoryId(userData.post_category_id || "");
            setDescription(userData.description || "");
            setStatus(userData.status === 1 || userData.status === 0 ? userData.status : "");
    
          //  onChange={setDescription} // The onChange prop will call setDescription to update the state
            //
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                id,
                name,
                post_category_id,
                description,
                status,
            };
            const response = await axios.post("/post/postInsert", formData, {
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
            navigate("/post/post-list");
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
        navigate('/post/role-list');
    };


    useEffect(() => {
        defaultFetch();
        PostDefaultFetch();

    }, []);

    return (
        <>
            <Helmet>
                <title>Post Edit</title>
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
                                <div className="breadcrumb-title pe-3">Post</div>
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
                                            <label htmlFor="input42" className="col-sm-3 col-form-label">Post Title</label>
                                            <div className="col-sm-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="input42"
                                                    placeholder="Enter Title"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                                {errors.name && <div style={{ color: "red" }}>{errors.name[0]}</div>}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <label htmlFor="input46" className="col-sm-3 col-form-label">Post Category</label>
                                            <div className="col-sm-9">
                                                <select
                                                    className="form-select"
                                                    id="input46"
                                                    value={post_category_id}
                                                    onChange={(e) => setPostCategoryId(e.target.value)}
                                                >
                                                    <option value="">Select Post Category</option>
                                                    {/* Map over your categories */}
                                                    {categoryData.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.post_category_id && <div style={{ color: "red" }}>{errors.post_category_id[0]}</div>}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <label htmlFor="input42" className="col-sm-3 col-form-label">Description</label>
                                            <div className="col-sm-9">
                                                <EditorComponent
                                                    className="form-control"
                                                    value={description}
                                                    onChange={setDescription} // The onChange prop will call setDescription to update the state
                                                />
                                                {/* <textarea
                                                    className="form-control"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="Enter Description"/> */}
                                                {errors.description && <div style={{ color: "red" }}>{errors.description[0]}</div>}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <label htmlFor="input46" className="col-sm-3 col-form-label">Status</label>
                                            <div className="col-sm-9">
                                                <select
                                                    className="form-select"
                                                    id="input46"
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value={1}>Active</option>
                                                    <option value={0}>Inactive</option>
                                                </select>
                                                {errors.status && <div style={{ color: "red" }}>{errors.status[0]}</div>}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <label className="col-sm-3 col-form-label" />
                                            <div className="col-sm-9">
                                                <button type="submit" className="btn btn-primary px-4">Submit</button>
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

export default PostEdit;