import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch orders from the API
  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/order/get-orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders.");
      }

      const data = await response.json();
      console.log(data); // Debugging: Check the fetched data
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/order/update-status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status.");
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

  // Filter orders by status
  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // Determine which buttons to display based on the status
  const getStatusButtons = (order) => {
    switch (order.status) {
      case "Processing":
        return (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(order._id, "Cancelled");
              }}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancel Order
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(order._id, "Delivering");
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
            >
              Mark as Delivering
            </button>
          </>
        );
      case "Delivering":
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(order._id, "Delivered");
            }}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Mark as Delivered
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2">
          Filter by status:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Processing">Processing</option>
          <option value="Delivering">Delivering</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {filteredOrders.map((order) => (
            <li
              key={order._id}
              className="mb-4 border p-4 rounded shadow-md cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Order</h2>
                {renderStatusInfo(order.status)}
              </div>
              <p>Amount: ${order.amount.toFixed(2)}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <div className="mt-2">{getStatusButtons(order)}</div>
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
              {new Date(selectedOrder.date).toLocaleDateString()}
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
            <p>
              <strong>Postal Code:</strong> {selectedOrder.address.postal_code}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrder;
