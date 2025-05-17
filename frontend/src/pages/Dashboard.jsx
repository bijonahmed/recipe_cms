// src/pages/Index.js
import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import GuestNavbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import AuthUser from "../components/AuthUser";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const rawToken = sessionStorage.getItem("token");
  const token = rawToken?.replace(/^"(.*)"$/, "$1");
  const [recipes, setRecipes] = useState([]);

  const handleEdit = (id) => {
    navigate(`/recipe-edit/${id}`);
  };

  const fetechRecipe = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/post/getRecipeList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("API Response:", response.data); // Log the response
      setRecipes(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };
  // Correctly closed useEffect hook
  useEffect(() => {
    fetechRecipe();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="bg-white p-0">
        <Header />

        {/* Recipe List */}
        <div className="container py-5" style={{ minHeight: "600px" }}>
          <h2 className="text-center mb-4 fw-bold">Submitted Recipes</h2>
          <div className="row">
            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div className="col-md-6 col-lg-4 mb-4" key={recipe.id}>
                  <div className="card h-100 shadow-sm border-0 rounded-4">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="card-img-top rounded-top-4"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                     <div className="card-body">
                      <h4 className="card-title">{recipe.r_name}</h4>
                      <p className="text-muted small">{recipe.email}</p>
                     
                    </div>

                      <div className="text-end mt-3">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(recipe.id)}
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No recipes submitted yet.</p>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
