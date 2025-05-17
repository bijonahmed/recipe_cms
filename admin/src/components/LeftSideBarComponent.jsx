import React, { useState, useEffect, useContext } from "react";
import axios from "/config/axiosConfig";
import { Link } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import { useNavigate } from "react-router-dom";
import $ from "jquery"; // Import jQuery
import "./css/LeftSideBarComponent.css";

const LeftSideBarComponent = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const token = JSON.parse(sessionStorage.getItem("token"));

  useEffect(() => {
    axios.get("/setting/dynamicLeftSidebarmenu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
       
      }).then((response) => {
        setMenuItems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the menu:", error);
      });
  }, []);



  const toggleSubmenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const { user } = AuthUser();
  useEffect(() => {}, []);

  return (
    <div className="sidebar-wrapper" data-simplebar="true">
      <div className="sidebar-header">
        <div>
          <h4 className="logo-text" style={{ fontSize: "12px" }}>
            <b>Dashboard</b>
          </h4>
        </div>
        <div className="toggle-icon ms-auto">
          <i className="bx bx-arrow-back" />
        </div>
      </div>
      {/*navigation*/}
      <ul className="metismenu" id="menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={item.submenu.length > 0 ? "has-arrow" : ""}
            >
              <div className="parent-icon">
                <i className={item.icon} />
              </div>
              <div className="menu-title">{item.label}</div>
            </Link>
            {item.submenu.length > 0 && (
              <ul className="open">
                {" "}
                {/* Always Open */}
                {item.submenu.map((subitem, subindex) => (
                  <li key={subindex}>
                    <Link to={subitem.path}>
                      <i className={subitem.icon} />
                      {subitem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/*end navigation*/}
    </div>
  );
};

export default LeftSideBarComponent;
