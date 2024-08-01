import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);

  // Fetch orders from the API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/order/history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order history.");
      }

      const data = await response.json();
      console.log(data); // Debugging: Check the fetched data
      setOrders(data);
    } catch (err) {
      // setError(err.message);
      console.log(err.message);
    }
  };
  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/order/cancel/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order.");
      }

      // Re-fetch the orders to get the updated list
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle order click to show details
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // Render status information with icons and text
  const renderStatusInfo = (status) => {
    switch (status) {
      case "Processing":
        return (
          <div className="flex items-center">
            <FaSpinner className="animate-spin text-yellow-500 mr-2" />
            <span className="text-yellow-500">Processing</span>
          </div>
        );
      case "Delivering":
        return (
          <div className="flex items-center">
            <FaTruck className="text-blue-500 mr-2" />
            <span className="text-blue-500">Delivering</span>
          </div>
        );
      case "Delivered":
        return (
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span className="text-green-500">Delivered</span>
          </div>
        );
      case "Cancelled":
        return (
          <div className="flex items-center">
            <FaTimesCircle className="text-red-500 mr-2" />
            <span className="text-red-500">Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {error && <p className="text-red-500">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="border p-4 rounded shadow-md cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Order</h2>
                {renderStatusInfo(order.status)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Amount:</p>
                  <p>${order.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold">Date:</p>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Payment Method:</p>
                  <p>{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="font-semibold">Paid:</p>
                  <p>{order.isPaid ? "Yes" : "No"}</p>
                </div>
              </div>
              {order.status === "Processing" && (
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelOrder(order._id);
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Status:</strong> {renderStatusInfo(selectedOrder.status)}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedOrder.amount.toFixed(2)}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleDateString()}
            </p>
            <h3 className="text-lg font-medium mt-4">Order Details:</h3>
            <ul>
              {selectedOrder.orderDetails.map((detail) => (
                <li key={detail._id} className="mb-2 flex items-center">
                  <img
                    src={detail.book_id.image}
                    alt={detail.book_id.title}
                    className="w-16 h-16 mr-4"
                  />
                  <div>
                    <p className="font-semibold">{detail.book_id.title}</p>
                    <p>Author: {detail.book_id.author}</p>
                    <p>Quantity: {detail.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <strong>Address:</strong> {selectedOrder.address.street},{" "}
              {selectedOrder.address.city}, {selectedOrder.address.country}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
