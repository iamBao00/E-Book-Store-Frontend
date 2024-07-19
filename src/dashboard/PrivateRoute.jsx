import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // `null` là trạng thái đang kiểm tra
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/users/check-auth-admin",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Gửi cookie cùng với yêu cầu
          }
        );
        const data = await response.json();
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          console.log(data.message);
          //window.location.href = `/login?${data.message}`;
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Failed to check auth", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng đến trang login và lưu lại đường dẫn hiện tại
    return (
      <Navigate
        to="/login?error=You need to log in first"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
