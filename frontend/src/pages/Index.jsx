import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import Footer from "../components/Footer";
import Header from "../components/GuestNavbar";
import Sliders from "../components/Sliders";
import WhatsApp from "../components/WhatsApp";
import Recipes from "../components/Recipes";
import RecipesCategory from "../components/RecipesCategory";
import Swal from "sweetalert2";
import DownloadApp from "../components/DownloadApp";

const Index = () => {

  return (
    <div>
      <Header />
      <Sliders />
      <Recipes />
      {/* <RecipesCategory /> */}
      <DownloadApp />
      <Footer />     
    </div>
  );
};

export default Index;
