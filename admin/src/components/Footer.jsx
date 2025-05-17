import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const Footer = () => {
  const { content } = useContext(LanguageContext);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="page-footer">
      <p className="mb-0">Copyright © {currentYear}. All rights reserved.</p>
    </footer>
  );
};

export default Footer;