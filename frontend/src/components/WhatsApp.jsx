import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import axios from "/config/axiosConfig";
import "./css/whatApp.css";
const WhatsApp = () => {
  const { content } = useContext(LanguageContext);
  const [name, setName] = useState("");

  const fetechGlobalData = async () => {
    try {
      const response = await axios.get(`/public/getGlobalData`);
      //console.log("Navbar API Response:", response.data); // Log the response
      setName(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetechGlobalData();
  }, []);

  return (
    <>
    <a
  href={`https://wa.me/${name.whatsApp}`} // Replace with your actual WhatsApp number
  target="_blank"
  rel="noopener noreferrer"
  className="whatsapp-btn-left"
  style={{ zIndex: 9999 }}
>
  <img
    src="/img/whatsapp-icon.png" // Replace with your actual icon path
    alt="WhatsApp"
    style={{ width: '60px', height: '60px' }}
  />
</a>
    </>
  );
};

export default WhatsApp;
