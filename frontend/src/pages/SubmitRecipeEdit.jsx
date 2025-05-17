import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import "../components/css/RecipeList.css";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const SubmitRecipeEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [globalData, setGlobalData] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    ingredients: "",
    category: "",
    cuisine: "",
    difficulty: "",
    servings: "",
    preparation_time: "",
    cooking_time: "",
    calories: "",
    status: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fetchCategoryData = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await axios.get("/category/getPostCategory", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCategoryData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const formDataToSend = new FormData();

      formDataToSend.append("id", formData.id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("ingredients", formData.ingredients);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("cuisine", formData.cuisine);
      formDataToSend.append("difficulty", formData.difficulty);
      formDataToSend.append("servings", formData.servings);
      formDataToSend.append("preparation_time", formData.preparation_time);
      formDataToSend.append("cooking_time", formData.cooking_time);
      formDataToSend.append("calories", formData.calories);
      formDataToSend.append("status",  formData.status);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post("/post/submit-recipe", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Recipe submitted successfully!",
        timer: 3000,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
      });

      navigate("/dashboard"); // Adjust the navigation path as needed

      // Reset form
      setFormData({
        name: "",
        description: "",
        ingredients: "",
        category: "",
        cusine: "",
        difficulty: "",
        servings: "",
        preparation_time: "",
        cooking_time: "",
        calories: "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: Object.values(error.response.data.errors)
            .map((err) => `<div>${err.join("<br>")}</div>`)
            .join(""),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "Please try again later.",
        });
        console.error("Submission error:", error);
      }
    }
  };

  const getRecipRow = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await axios.get(`/post/getReciperowcheck`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          slug: slug,
        },
      });

      console.log("selet status : " + response.data.data.status);



      setFormData({
        id: response.data.data.id || "",
        name: response.data.data.name || "",
        description: response.data.data.description || "",
        ingredients: response.data.data.ingredients || "",
        category: response.data.data.category_id || "",
        cuisine: response.data.data.cuisine || "",
        difficulty: response.data.data.difficulty || "",
        servings: response.data.data.servings || "",
        preparation_time: response.data.data.preparation_time || "",
        cooking_time: response.data.data.cooking_time || "",
        calories: response.data.data.calories || "",
        status: response.data.data.status ?? "",
      });
      setImagePreview(response.data.image);
      //console.log("====" + response.data.data.name);
      //setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const fetchGlobalData = async () => {
    try {
      const response = await axios.get(`/public/getGlobalData`);
      setGlobalData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    getRecipRow();
    fetchCategoryData();
    fetchGlobalData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Edit Recipe</title>
      </Helmet>
      <Header />

      {/* Submit Form */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="recipe-card">
                <h4 className="text-danger text-center">SUBMIT YOUR RECIPE</h4>
                <h2 className="fw-bold py-3 text-center text-black">
                  Share Your Favorite Recipe With Us!
                </h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="Title"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      rows="5"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="Describe your recipe..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ingredients</label>
                    <textarea
                      name="ingredients"
                      rows="5"
                      value={formData.ingredients}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="Ingredients..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-control recipe-input"
                    >
                      <option value="">Select a category</option>
                      {Array.isArray(categoryData) &&
                        categoryData.map((category, index) => (
                          <option key={index} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cuisine</label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="Cuisine"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Difficulty</label>
                    <input
                      type="text"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="Difficulty"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Servings</label>
                    <input
                      type="text"
                      name="servings"
                      value={formData.servings}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="e.g. 4 servings"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Preparation Time</label>
                    <input
                      type="text"
                      name="preparation_time"
                      value={formData.preparation_time}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="e.g. 30 mins"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cooking Time</label>
                    <input
                      type="text"
                      name="cooking_time"
                      value={formData.cooking_time}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="e.g. 45 mins"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Calories</label>
                    <input
                      type="text"
                      name="calories"
                      value={formData.calories}
                      onChange={handleChange}
                      className="form-control recipe-input"
                      placeholder="e.g. 500"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Recipe Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="form-control recipe-input"
                    />
                    {imagePreview && (
                      <div className="mt-3 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{
                            maxHeight: "300px",
                            objectFit: "cover",
                            borderRadius: "1rem",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-danger submit-btn mt-3"
                    >
                      Submit Recipe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubmitRecipeEdit;
