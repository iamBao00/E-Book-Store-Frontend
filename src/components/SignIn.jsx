import React, { useState } from "react";

const SignIn = () => {
  const [error, setError] = useState(""); // State để lưu thông báo lỗi

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const username = form.username.value;
    const password = form.password.value;

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Đảm bảo cookie được gửi cùng yêu cầu
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful", data);
        // Xử lý sau khi đăng nhập thành công
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        console.error("Login failed", errorData);
        // Xử lý thông báo lỗi từ phản hồi
        setError(errorData.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
          Login your account!
        </h1>
        <form action="/" onSubmit={handleFormSubmit}>
          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
              placeholder="username"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter your password"
              required
            />
            <a
              href="#"
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Forgot Password?
            </a>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <label
                htmlFor="remember"
                className="block text-sm text-gray-700 dark:text-gray-300"
              >
                Don't have an account?
              </label>
            </div>
            <a
              href="/sign-up"
              className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create One
            </a>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
