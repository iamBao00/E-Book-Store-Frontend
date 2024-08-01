import React, { useState } from "react";

const SignUp = () => {
  const [error, setError] = useState(""); // State để lưu thông báo lỗi
  const [success, setSuccess] = useState(""); // State để lưu thông báo thành công

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login page after success
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration failed", err);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-10 flex flex-col items-center">
        <h1 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-8">
          Register
        </h1>
        <form
          onSubmit={handleFormSubmit}
          className="w-full flex flex-col gap-4"
        >
          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-500 text-center">{success}</div>
          )}
          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="username"
              className="text-sm text-gray-700 dark:text-gray-200 mr-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="email"
              className="text-sm text-gray-700 dark:text-gray-200 mr-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="password"
              className="text-sm text-gray-700 dark:text-gray-200 mr-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-start flex-col justify-start">
            <label
              htmlFor="confirmPassword"
              className="text-sm text-gray-700 dark:text-gray-200 mr-2"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500 dark:text-gray-300">
            Already have an account?{" "}
          </span>
          <a href="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
