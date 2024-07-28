import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiChartPie,
  HiInbox,
  HiOutlineCloudUpload,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import userImg from "../assets/profile.jpg";

const SideBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This ensures cookies are included in the request
      });

      if (response.ok) {
        // Clear any client-side state or cookies as needed
        console.log("Logged out successfully");
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem("user");
        // Chuyển hướng đến trang đăng nhập
        window.location.href = "/login";
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
          <Sidebar.Item
            href="/admin/dashboard/upload"
            icon={HiOutlineCloudUpload}
          >
            Upload Book
          </Sidebar.Item>
          <Sidebar.Item href="/admin/dashboard" icon={HiInbox}>
            Manage Book
          </Sidebar.Item>
          <Sidebar.Item href="/admin/dashboard/category" icon={HiChartPie}>
            Magane Category
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Infomation
          </Sidebar.Item>
          <Sidebar.Item href="/admin/dashboard/order" icon={HiShoppingBag}>
            Manage Order
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
