import React, { useState, useEffect } from "react";

const ManageCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [books, setBooks] = useState({}); // To store book details
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies with the request
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems(data);
        console.log("data from fetchCartItems:", data);

        // Fetch book details for each cart item
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

  const handleRemoveItem = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/cart/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        // Fetch updated cart items from server
        fetchCartItems();
      } else {
        console.error("Failed to remove item:", response.statusText);
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/cart/quantity/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      if (response.ok) {
        // Fetch updated cart items from server
        fetchCartItems();
      } else {
        console.error("Failed to update quantity:", response.statusText);
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleOrder = async () => {
    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cartItems }),
      });
      if (response.ok) {
        console.log("Order placed successfully");
        setCartItems([]);
        setBooks({});
        setTotalAmount(0);
      } else {
        console.error("Failed to place order:", response.statusText);
      }
    } catch (err) {
      console.error("Failed to place order:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          <ul>
            {cartItems.map((item) => {
              const book = books[item.book_id];
              return (
                <li
                  key={item._id}
                  className="flex justify-between items-center mb-4 p-4 border rounded-md"
                >
                  <div className="flex items-center">
                    {book && book.image && (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-16 h-16 object-cover mr-4"
                      />
                    )}
                    <div>
                      {book ? (
                        <>
                          <span className="block font-bold">{book.title}</span>
                          <span className="block text-gray-600">
                            Price: ${book.price}
                          </span>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.book_id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-12 text-center border-t border-b border-gray-300"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.book_id,
                                  item.quantity + 1
                                )
                              }
                              className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r"
                            >
                              +
                            </button>
                          </div>
                        </>
                      ) : (
                        <span>Loading book details...</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.book_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 text-right">
            <span className="font-bold">
              Total Amount: ${totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="mt-4">
            <button
              onClick={handleOrder}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Order
            </button>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default ManageCart;
