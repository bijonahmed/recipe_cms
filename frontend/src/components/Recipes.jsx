// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";

import axios from "/config/axiosConfig";
import $ from "jquery";

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetechRecipe = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/public/getRecipeList`);
      //console.log("API Response:", response.data); // Log the response
      setRecipes(response.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetechRecipe();
  }, []);

  return (
    <>
      <div className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-xl-7 col-lg-8 col-md-10 col-12">
              <div className="text-center">
                <h1 className="fw-bold pb-2 display-5 text-black">
                  Recipes of the Week
                </h1>
              </div>
            </div>
          </div>
          <div className="row g-4">
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
                    <Link to={`/recipe-details/${recipe.slug}`}><img
                      src={recipe.image}
                      alt={recipe.r_name}
                      className="card-img-top rounded-top-4"
                      style={{ height: "250px", objectFit: "cover" }}
                    /></Link>

                    <div className="card-body px-4 pt-4">
                      <Link
                        to={`/recipe-details/${recipe.slug}`}
                        className="badge text-bg-danger rounded-pill px-3 py-2"
                      >
                        {recipe.catName}
                      </Link>
                      <Link to={`/recipe-details/${recipe.slug}`}>
                        <h4 className="card-title fw-bold pt-3 h3">
                          {recipe.r_name}
                        </h4>
                      </Link>
                    </div>

                    <div className="card-footer bg-transparent border-0 px-4 pb-4">
                      <small className="d-flex align-items-center gap-2">
                        <Link to={`/recipe-details/${recipe.slug}`} className="d-none">
                          <img
                            src="/img/profile/2.jpg"
                            alt="post-profile"
                            className="img-fluid rounded-circle post-profile"
                          />
                        </Link>
                        <Link to={`/recipe-details/${recipe.slug}`}>{recipe.name}</Link> <span>/</span>{recipe.created_at}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No recipes submitted yet.</p>
            )}
            <div className="col-12">
              <div className="text-center mt-4">
                <Link
                  to="/recipes"
                  className="btn btn-danger btn-lg rounded-pill"
                >
                  View all Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recipes;
