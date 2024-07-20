import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    country: "",
    city: "",
    postal_code: "",
    street: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [books, setBooks] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAddresses();
    fetchCartItems();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/get-address", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses(data);
      } else {
        console.error("Failed to fetch addresses:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems(data);
        fetchBooks(data);
      } else {
        console.error("Failed to fetch cart items:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
    }
  };

  const fetchBooks = async (cartItems) => {
    try {
      const bookRequests = cartItems.map((item) =>
        fetch(`http://localhost:3000/book/getById/${item.book_id}`).then(
          (response) => response.json()
        )
      );
      const books = await Promise.all(bookRequests);
      const bookMap = books.reduce((acc, book) => {
        acc[book._id] = book;
        return acc;
      }, {});
      setBooks(bookMap);
      calculateTotalAmount(cartItems, bookMap);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const calculateTotalAmount = (cartItems, books) => {
    const total = cartItems.reduce((acc, item) => {
      const book = books[item.book_id];
      return acc + (book ? book.price * item.quantity : 0);
    }, 0);
    setTotalAmount(total);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod || (!selectedAddress && !isNewAddressValid())) {
      alert("Please select a payment method and address.");
      return;
    }

    const addressToSend = selectedAddress || newAddress;
    try {
      const response = await fetch("http://localhost:3000/order/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ paymentMethod, address: addressToSend }),
      });
      if (response.ok) {
        alert("Order placed successfully");
        navigate("/");
      } else {
        console.error("Failed to place order:", response.statusText);
      }
    } catch (err) {
      console.error("Failed to place order:", err);
    }
  };

  const isNewAddressValid = () => {
    return (
      newAddress.country &&
      newAddress.city &&
      newAddress.postal_code &&
      newAddress.street
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Address</h2>
        {addresses.length > 0 ? (
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select an address</option>
            {addresses.map((address) => (
              <option key={address._id} value={address._id}>
                {address.street}, {address.city}, {address.country} -{" "}
                {address.postal_code}
              </option>
            ))}
          </select>
        ) : (
          <p>No addresses found. Please enter a new address.</p>
        )}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Enter New Address</h2>
          <input
            type="text"
            placeholder="Country"
            value={newAddress.country}
            onChange={(e) =>
              setNewAddress({ ...newAddress, country: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="text"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={newAddress.postal_code}
            onChange={(e) =>
              setNewAddress({ ...newAddress, postal_code: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="text"
            placeholder="Street"
            value={newAddress.street}
            onChange={(e) =>
              setNewAddress({ ...newAddress, street: e.target.value })
            }
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
        <div>
          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            Cash
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="momo"
              checked={paymentMethod === "momo"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            MoMo
          </label>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Cart Items</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cartItems.map((item) => {
            const book = books[item.book_id];
            return (
              <li
                key={item.book_id}
                className="border p-4 rounded-md flex items-center bg-white shadow-md"
              >
                {book ? (
                  <>
                    <img
                      src={book.image} // Ensure your book schema includes the image field
                      alt={book.title}
                      className="w-16 h-24 object-cover mr-4 rounded-md"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{book.title}</h3>
                      <p>
                        ${book.price} x {item.quantity}
                      </p>
                    </div>
                  </>
                ) : (
                  <span>Loading book details...</span>
                )}
              </li>
            );
          })}
        </ul>
        <div className="font-bold mt-4">Total: ${totalAmount.toFixed(2)}</div>
      </div>
      <button
        onClick={handlePlaceOrder}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Place Order
      </button>
    </div>
  );
};

export default PaymentPage;
