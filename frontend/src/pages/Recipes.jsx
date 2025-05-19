import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import { Helmet } from "react-helmet";

const Recipes = () => {
  const [name, setName] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGlobalData = async () => {
    try {
      const response = await axios.get(`/public/getGlobalData`);
      setName(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const fetchRecipe = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/public/getRecipeData?page=${page}`);
      setRecipes(response.data.data); // paginated data
      setTotalPages(response.data.totalPages); // optional: for showing pagination UI
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Recipes</title>
      </Helmet>
      <Header />

      <div>
        <div className="bg-white py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 col-md-10 col-12">
                <div className="text-center">
                  <h1 className="fw-bold pb-2 display-1 text-black">Recipes</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All recipes */}
        <div className="pb-5">
          <div className="container pb-5">
            <div className="row g-5">
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <div key={recipe.id} className="col-lg-4 col-md-6 col-12">
                    <div className="card border-0 shadow-sm rounded-5 overflow-hidden h-100">
                      <Link to={`/recipe-details/${recipe.slug}`}>
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="card-img-top rounded-top-4"
                          style={{ height: "250px", objectFit: "cover" }}
                        />
                      </Link>
                      <div className="card-body px-4 pt-4">
                        <Link to={`/recipe-details/${recipe.slug}`}>
                          <h4 className="card-title fw-bold pt-3 h3">
                            {recipe.r_name}
                          </h4>
                        </Link>
                      </div>
                      <div className="card-footer bg-transparent border-0 px-4 pb-4">
                        <small className="d-flex align-items-center gap-2">
                          <Link to={`/recipe-details/${recipe.slug}`}></Link>{" "}
                          <Link to={`/recipe-details/${recipe.slug}`}>
                            {recipe.name}
                          </Link>{" "}
                          <span>/</span>
                          {recipe.created_at}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No recipes submitted yet.</p>
              )}

              <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn mx-1 ${
                      currentPage === i + 1
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Recipes;
