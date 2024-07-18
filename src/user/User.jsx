import React from "react";

export const User = () => {
  (async function () {
    try {
      const response = await fetch("http://localhost:3000/users/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Gửi cookie cùng với yêu cầu
      });

      console.log(response.ok);
      if (response.ok) {
        const data = await response.json();
        console.log("CART:", data);
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid username or password");
    }
  })();
  return <div>User</div>;
};
