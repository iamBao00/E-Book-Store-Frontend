import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";

const PaymentPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    country: "",
    city: "",
    postal_code: "",
    street: "",
  });
  const [phoneNumber, setPhoneNumber] = useState(""); // Separate phone number state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [books, setBooks] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [sdkReady, setSdkReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
    fetchCartItems();
    fetchPhoneNumber();
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      const address = addresses.find((addr) => addr._id === selectedAddress);
      if (address) {
        setNewAddress({
          country: address.country,
          city: address.city,
          postal_code: address.postal_code,
          street: address.street,
        });
      }
    }
  }, [selectedAddress]);

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

  const fetchPhoneNumber = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/get-phone", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setPhoneNumber(data.phoneNumber);
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
    if (!paymentMethod || !isNewAddressValid() || !phoneNumber) {
      alert(
        "Please select a payment method, enter a valid address, and provide a phone number."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/order/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paymentMethod,
          address: newAddress,
          phoneNumber,
        }), // Send phoneNumber separately
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Order placed successfully");
        navigate("/user/manage-cart");
      } else {
        alert(`Failed to place order: ${responseData.message}`);
        console.error("Failed to place order:", responseData.message);
      }
    } catch (err) {
      console.error("Failed to place order:", err);
      alert(
        "An error occurred while placing the order. Please try again later."
      );
    }
  };

  const isNewAddressValid = () => {
    return (
      newAddress.country &&
      newAddress.city &&
      newAddress.postal_code &&
      newAddress.street &&
      phoneNumber // Ensure phone number is also valid
    );
  };

  const addPaypalScript = async () => {
    const response = await fetch("http://localhost:3000/order/config", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const clientID = data.data;
    if (response.ok) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    } else {
      console.log("Failed to get Client ID");
    }
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

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
          <h2 className="text-xl font-semibold mb-2">Address</h2>
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
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <h2 className="text-xl font-semibold mb-2">Phone Number</h2>
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} // Update phone number state
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
            COD
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            Paypal
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
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-800 font-semibold">
                        Price: ${book.price}
                      </p>
                    </div>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Total Amount</h2>
        <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
      </div>
      {!isNewAddressValid() ||
        (!phoneNumber && (
          <p className="text-red-500">
            Please enter a valid address and phone number before placing an
            order.
          </p>
        ))}
      {sdkReady && paymentMethod === "paypal" && (
        <PayPalButton
          amount={totalAmount}
          onSuccess={(details, data) => handlePlaceOrder(details, data)}
          onError={() => {
            alert("Error occurred while processing payment with PayPal.");
          }}
        />
      )}
      {paymentMethod === "cash" && (
        <button
          onClick={handlePlaceOrder}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Place Order
        </button>
      )}
    </div>
  );
};

export default PaymentPage;
