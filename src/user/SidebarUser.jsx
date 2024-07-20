import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiInbox,
  HiOutlineCloudUpload,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import { FaHistory } from "react-icons/fa";
import userImg from "../assets/profile.jpg";

const SideBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("user");
    // Chuyển hướng đến trang đăng nhập
    window.location.href = "/login";
  };

  return (
    <Sidebar
      aria-label="Sidebar with content separator example"
      className="blurred-sidebar"
    >
      <Sidebar.Logo href="#" img={userImg} imgAlt="logo" className="">
        <p className="ml-3">{user ? user.username : "Username"}</p>
      </Sidebar.Logo>

      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiUser}>
            Infomation
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiOutlineCloudUpload}>
            Review History
          </Sidebar.Item>
          <Sidebar.Item href="/user/manage-cart" icon={HiInbox}>
            Manage Cart
          </Sidebar.Item>
          <Sidebar.Item href="/user/order-history" icon={FaHistory}>
            Order History
          </Sidebar.Item>
          <Sidebar.Item href="/shop" icon={HiShoppingBag}>
            Back to Shop
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiTable} onClick={handleLogout}>
            Log out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SideBar;
