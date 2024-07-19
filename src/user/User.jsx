import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarUser from "./SidebarUser";

export const User = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/check-auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Gửi cookie cùng với yêu cầu
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          console.log("User info:", data.user);
        } else {
          window.location.href = "/login?error=You need to log in first";
        }
      } catch (err) {
        console.error("Failed to check auth", err);
        setError("Failed to check auth. Please try again.");
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <SideBarUser />
      <Outlet />
    </div>
  );
};
