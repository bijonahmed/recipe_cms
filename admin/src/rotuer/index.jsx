// src/Router.js
import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Frontend
import Index from "../pages/Index.jsx";
import Signup from "../pages/Signup.jsx";
import Forgetpassword from "../pages/Forgetpassword.jsx";
import Register from "../pages/Register";
import Login from "../pages/Login";
import UserLogin from "../pages/UserLogin.jsx";
import ChangePassword from "../pages/users/ChangePassword.jsx";
//For Admin Panel 
import Dashboard from "../pages/Dashboard";

import MyProfile from "../pages/users/MyProfile.jsx";
import MerchantList from "../pages/users/UsersList.jsx";
import RoleList from "../pages/users/RoleList.jsx";
import RoleAdd from "../pages/users/Addrole.jsx";
import BulkAddress from "../pages/configration/address/BulkAddress.jsx";
import RecipeReport from "../pages/report/RecipeReport.jsx";
import CheckLogAPI from "../pages/report/CheckLogAPI.jsx";


import RoleEdit from "../pages/users/EditRole.jsx";
import UserEdit from "../pages/users/EditUser.jsx";
import SuperAdminList from "../pages/users/SuperAdminList.jsx";
import CustomerList from "../pages/users/CustomerList.jsx";
import UserAddAdmin from "../pages/users/UserAddAdmin.jsx";
import CustomerAdd from "../pages/users/CustomerAdd.jsx";

import AdminList from "../pages/users/AdminList.jsx";
import UserAdd from "../pages/users/UserAdd.jsx";
import UserAddSupperAdmin from "../pages/users/UserAddSupperAdmin.jsx";
import PostCategoryList from "../pages/category/PostCategoryList.jsx";
import PostCategoryAdd from "../pages/category/PostCategoryAdd.jsx";
import PostCategoryEdit from "../pages/category/PostCategoryEdit.jsx";
import PostList from "../pages/post/PostList.jsx";
import PostAdd from "../pages/post/PostAdd.jsx";
import PostEdit from "../pages/post/PostEdit.jsx";
//Booking
import RoomStatusList from "../pages/booking/RoomStatusList.jsx";
import BookingList from "../pages/booking/BookingList.jsx";
import AddNewBooking from "../pages/booking/AddNewBooking.jsx";
import CheckOutList from "../pages/booking/CheckOutList.jsx";
//ROOM SETTING LIST
import RecipeEdit from "../pages/recipe/RecipeEdit.jsx";
import BedTypeList from "../pages/roomsetting/BedTypeList.jsx";
import BedTypeAdd from "../pages/roomsetting/BedTypeAdd.jsx";
import BedTypeEdit from "../pages/roomsetting/BedTypeEdit.jsx";
import BookingTypeList from "../pages/roomsetting/BookingTypeList.jsx";
import BookingTypeAdd from "../pages/roomsetting/BookingTypeAdd.jsx";
import BookingTypeEdit from "../pages/roomsetting/BookingTypeEdit.jsx";
import RoomSizeList from "../pages/roomsetting/RoomSizeList.jsx";
import RoomSizeAdd from "../pages/roomsetting/RoomSizeAdd.jsx";
import RoomSizeEdit from "../pages/roomsetting/RoomSizeEdit.jsx";
import RoomList from "../pages/roomsetting/RoomList.jsx";
import RoomAdd from "../pages/roomsetting/RoomAdd.jsx";
import RoomEdit from "../pages/roomsetting/RoomEdit.jsx";
import RoomImagesList from "../pages/roomsetting/RoomImagesList.jsx";
import PromocodeList from "../pages/roomsetting/PromocodeList.jsx";
import PromocodeAdd from "../pages/roomsetting/PromocodeAdd.jsx";
import PromoCodeEdit from "../pages/roomsetting/PromoCodeEdit.jsx";
import RoomFacilitiesEdit from "../pages/roomsetting/RoomFacilitiesEdit.jsx";
import FacilitesGroupList from "../pages/facilites/FacilitesGroupList.jsx";
import FacilitesGroupAdd from "../pages/facilites/FacilitesGroupAdd.jsx";
import FacilitesGroupEdit from "../pages/facilites/FacilitesGroupEdit.jsx";
import FacilitesList from "../pages/facilites/FacilitesList.jsx";
import FacilitesAdd from "../pages/facilites/FacilitesAdd.jsx";
import FacilitesEdit from "../pages/facilites/FacilitesEdit.jsx";
import RoomPreview from "../pages/roomsetting/RoomPreview.jsx";
//
import GeneralCategoryList from "../pages/category/GeneralCategoryList.jsx";
import GeneralCategoryAdd from "../pages/category/GeneralCategoryAdd.jsx";
import GeneralCategoryEdit from "../pages/category/GeneralCategoryEdit.jsx";
import GlobalWalletAddressList from "../pages/wallet/GlobalWalletAddressList.jsx";
import GlobalWalletAddressAdd from "../pages/wallet/GlobalWalletAddressAdd.jsx";
import GlobalWalletAddressEdit from "../pages/wallet/GlobalWalletAddressEdit.jsx"
import ConfigrrationApiKeyList from "../pages/configration/ConfigrrationAPikeyList.jsx";
import ConfigrrationApiKeyAdd from "../pages/configration/ConfigrationApiKeyAdd.jsx";
import ConfigrrationApiKeyEdit from "../pages/configration/ConfigrationApiKeyEdit.jsx";
import StatusEdit from "../pages/report/StatusEdit.jsx";
import CheckTronScanAPI from "../pages/report/CheckTronScanAPI.jsx";
import GlobalSetting from "../pages/setting/GlobalSetting.jsx";
import Slider from "../pages/setting/Slider.jsx";
import Service from "../pages/setting/Service.jsx";

const AppRouter = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Index />} /> general-categoryAdd*/}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forget-password" element={<Forgetpassword />} />
      <Route path="/user/profile" element={<MyProfile />} />
      <Route path="/user/role-list" element={<RoleList />} />
      <Route path="/user/role-add" element={<RoleAdd />} />
      <Route path="/user/user-add" element={<UserAdd />} />
      <Route path="/user/user-add-supperadmin" element={<UserAddSupperAdmin />} />
      <Route path="/user/role-edit/:id" element={<RoleEdit />} />
      <Route path="/user/user-edit/:id" element={<UserEdit />} />
      <Route path="/user/users-list" element={<MerchantList />} />
      <Route path="/user/superadmin-list" element={<SuperAdminList />} />
      <Route path="/user/customer-list" element={<CustomerList />} />
      <Route path="/user/user-add-admin" element={<UserAddAdmin />} />
      <Route path="/user/customer-add" element={<CustomerAdd />} />
      <Route path="/user/admin-list" element={<AdminList />} />
      <Route path="/report/recipe-report" element={<RecipeReport />} />
      <Route path="/user/change-password" element={<ChangePassword />} />
      <Route path="/category/post-category-list" element={<PostCategoryList />} />
      <Route path="/category/post-categoryAdd" element={<PostCategoryAdd />} />
      <Route path="/category/post-category-edit/:id" element={<PostCategoryEdit />} />
      <Route path="/category/general-category-edit/:id" element={<GeneralCategoryEdit />} />
      <Route path="/report/status-edit/:id" element={<StatusEdit />} />
      <Route path="/category/global-category-list" element={<GeneralCategoryList />} />
      <Route path="/recipe/edit/:id" element={<RecipeEdit />} />
      <Route path="/post/post-list" element={<PostList />} />
      <Route path="/post/post-add" element={<PostAdd />} />
      <Route path="/post/post-edit/:id" element={<PostEdit />} />
      <Route path="/category/general-category-add" element={<GeneralCategoryAdd />} />
      <Route path="/wallet/global-wallet-address-list" element={<GlobalWalletAddressList />} />
      <Route path="/wallet/global-wallet-address-add" element={<GlobalWalletAddressAdd />} />
      <Route path="/configration/config-api-key-list" element={<ConfigrrationApiKeyList />} />
      <Route path="/configration/config-api-key-add" element={<ConfigrrationApiKeyAdd />} />
      <Route path="/configration/config-api-key-edit/:id" element={<ConfigrrationApiKeyEdit />} />
      <Route path="/configration/address/merchant-address/:id" element={<BulkAddress />} />
      <Route path="/wallet/global-wallet-edit/:id" element={<GlobalWalletAddressEdit />} />
      <Route path="/report/tronscan-api" element={<CheckTronScanAPI />} />
      <Route path="/report/check-api-log" element={<CheckLogAPI />} />
      {/* Booking */}
      <Route path="/booking/room-status-list" element={<RoomStatusList />} />
      <Route path="/booking/booking-list" element={<BookingList />} />
      <Route path="/booking/add-new-booking" element={<AddNewBooking />} />
      <Route path="/booking/checkout-list" element={<CheckOutList />} />
      {/* //ROMM SETTING */}
      <Route path="/roomsetting/bed-type-list" element={<BedTypeList />} />
      <Route path="/roomsetting/add-bed-type" element={<BedTypeAdd />} />
      <Route path="/roomsetting/bed-type-edit/:id" element={<BedTypeEdit />} />
      <Route path="/roomsetting/booking-type-list" element={<BookingTypeList />} />
      <Route path="/roomsetting/add-booking-type" element={<BookingTypeAdd />} />
      <Route path="/roomsetting/booking-type-edit/:id" element={<BookingTypeEdit />} />
      <Route path="/roomsetting/room-size-list" element={<RoomSizeList />} />
      <Route path="/roomsetting/add-room-size" element={<RoomSizeAdd />} />
      <Route path="/roomsetting/room-size-edit/:id" element={<RoomSizeEdit />} />
      <Route path="/roomsetting/room-list" element={<RoomList />} />
      <Route path="/roomsetting/add-room" element={<RoomAdd />} />
      <Route path="/roomsetting/room-edit/:id" element={<RoomEdit />} />
      <Route path="/roomsetting/room-images-list" element={<RoomImagesList />} />
      <Route path="/roomsetting/promocode-list" element={<PromocodeList />} />
      <Route path="/roomsetting/promocode-add" element={<PromocodeAdd />} />
      <Route path="/roomsetting/promocode-edit/:id" element={<PromoCodeEdit />} />
      <Route path="/roomsetting/room-facilities-edit/:id" element={<RoomFacilitiesEdit />} />
      <Route path="/roomsetting/room-preview/:id" element={<RoomPreview />} />
      {/* FACILITY SETTING */}
      <Route path="/facilites/facilites-group-list" element={<FacilitesGroupList />} />
      <Route path="/facilites/facilites-group-add" element={<FacilitesGroupAdd />} />
      <Route path="/roomsetting/facilites-group-edit/:id" element={<FacilitesGroupEdit />} />
      <Route path="/facilites/facilites-list" element={<FacilitesList />} />
      <Route path="/facilites/facilites-add" element={<FacilitesAdd />} />
      <Route path="/roomsetting/facilites-edit/:id" element={<FacilitesEdit />} />
      <Route path="/setting/global-setting" element={<GlobalSetting />} />
      <Route path="/setting/slider-list" element={<Slider />} />
      <Route path="/setting/service-list" element={<Service />} />


      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRouter;
