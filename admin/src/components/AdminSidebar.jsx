// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import AuthUser from "../components/AuthUser";
import axios from "/config/axiosConfig";



const AdminSidebar = () => {


    const [image, setImage] = useState("");
    const { getToken, token, logout } = AuthUser();
    const { user } = AuthUser();
    const navigate = useNavigate();
    const logoutUser = () => {
      if (token !== undefined) {
        logout();
      }
    };

    const fetchUserData = async () => {
        
        
        try {
          const token = JSON.parse(sessionStorage.getItem("token")); // Retrieve the token from local storage
          const response = await axios.get("/user/checkCurrentUser", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("response", response.data.image);
          
          setImage(response.data.image);
          //setStatus(response.data.data.status.toString());
        } catch (error) {
          console.error("Error fetching brand data:", error);
        } 
      };


    useEffect(() => {
        fetchUserData();
      if (!token) {
        navigate("/");
      }
    
      console.log("Token changed or component mounted");
    }, [token]); // Only re-run effect if token changes

  return (
    <>
    <div className="sidebar_list">
    <aside>
    <button className="btn_sidebar"><i className="fa-regular fa-chevron-right"></i></button>
      <div className="sidebar_profile">
        <div className="profile_picture">
          <label htmlFor="profile"> 
          {image ? (
          <center>
            <img src={image} alt="Description" className="img-thumbnail" />
          </center>
        ) : <img src="images/user-100.png" className="img-thumbnail" />}
            </label>
        </div>
        <div>
          <h4>Registered</h4>
          <p>{user?.name || user?.email}!</p>
        </div>
      </div>
      <ul>
        <h4>Profile</h4>
        <li><Link to="/users/profile"><i className="fa-regular fa-user" /><span>Profile</span></Link></li>
        <li className="active"><Link to="/users/change-password"><i className="fa-regular fa-lock" /><span>Change Password</span></Link></li>
        <li className="active"><a href="#"><i className="fa fa-credit-card" /><span>Payment</span></a></li>
        {/* <li><a href="team.html"><i className="fa-light fa-circle-nodes" /><span>Team</span></a></li> */}
        <li><a href="#" onClick={logoutUser}><i className="fa fa-sign-out" /><span>Logout</span></a></li>
      </ul>
    </aside>
  </div>

    </>
  );
};

export default AdminSidebar;
