import React, { useState, useEffect, useContext } from 'react'; // Ensure useContext is imported
import { useNavigate, Link, useParams } from 'react-router-dom'; // Combine imports from react-router-dom
import axios from '/config/axiosConfig'; // Assuming your axios config is correct
import AuthUser from "../components/AuthUser";

const Navbar = () => {

  const navigate = useNavigate(); // Move useNavigate inside the component

  const toggleTheme = () => {
    const htmlElement = document.documentElement; // <html> element
    const currentTheme = htmlElement.classList.contains('dark-theme') ? 'dark' : 'light';

    if (currentTheme === 'dark') {
      htmlElement.classList.remove('dark-theme');
      htmlElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.classList.remove('light-theme');
      htmlElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  };
  const { user, token, logout } = AuthUser();

  const role = (() => {
    if (user?.role_id === 1) return "Super Admin";
    if (user?.role_id === 2) return "Merchant";
    if (user?.role_id === 3) return "Admin";
    return "Unknown Role"; // Default case
  })();

  // Load theme from localStorage when the component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    const htmlElement = document.documentElement;

    htmlElement.classList.remove('light-theme', 'dark-theme'); // Clear any existing theme
    htmlElement.classList.add(`${savedTheme}-theme`);


  }, []);

  const logoutUser = async () => {
    if (token) {
      await logout();
      navigate('/login');
    }
  };

  return (

    <div className="topbar d-flex align-items-center">
      <nav className="navbar navbar-expand gap-3">
        <div className="mobile-toggle-menu"><i className="bx bx-menu" />
        </div>
        <div className="search-bar d-lg-block d-none" data-bs-toggle="modal" data-bs-target="#SearchModal">
          <Link to="#" className="btn d-flex align-items-center"><i className="bx bx-search" />Search</Link>
        </div>
        <div className="top-menu ms-auto">
          <ul className="navbar-nav align-items-center gap-1">
            <li className="nav-item mobile-search-icon d-flex d-lg-none" data-bs-toggle="modal" data-bs-target="#SearchModal">
              <Link className="nav-link" href="#"><i className="bx bx-search" />
              </Link>
            </li>

            <li className="nav-item dark-mode d-none d-sm-flex">
              <a
                className="nav-link dark-mode-icon"
                href="#"
                onClick={toggleTheme}>
                <i className="bx bx-moon" />
              </a>
            </li>


          </ul>
        </div>
        <div className="user-box dropdown px-3">
          <a className="d-flex align-items-center nav-link dropdown-toggle gap-3 dropdown-toggle-nocaret" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="/assets/images/avatars/usdt.png" className="user-img" />
            <div className="user-info">
              <p className="user-name mb-0">{user?.name || user?.email}</p>
              <p className="designattion mb-0">{role}</p>
            </div>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><Link className="dropdown-item d-flex align-items-center" to="/user/profile"><i className="bx bx-user fs-5" /><span>Profile</span></Link>
            </li>
            <li>
              <div className="dropdown-divider mb-0" />
            </li>
            <li><a className="dropdown-item d-flex align-items-center" href="#" onClick={logoutUser}><i className="bx bx-log-out-circle" /><span>Logout</span></a>
            </li>
          </ul>
        </div>
      </nav>
    </div>

  );
};

export default Navbar;
