// import React, { useEffect, useState } from "react";
// import { Card } from "flowbite-react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
// import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

// const Shop = () => {
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [selectedBook, setSelectedBook] = useState(null); // Book to add to cart
//   const [quantity, setQuantity] = useState(1); // Quantity of book to add
//   const [showPopup, setShowPopup] = useState(false); // Show/Hide popup
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:3000/book/get-all")
//       .then((res) => res.json())
//       .then((data) => setBooks(data));

//     fetch("http://localhost:3000/category/get-all")
//       .then((res) => res.json())
//       .then((data) => setCategories(data));
//   }, []);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleCategoryChange = (e) => {
//     setSelectedCategory(e.target.value);
//   };

//   const filteredBooks = books.filter((book) => {
//     return (
//       book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (selectedCategory === "" || book.category_name === selectedCategory)
//     );
//   });

//   const handleCardClick = (bookId) => {
//     navigate(`/book/${bookId}`);
//   };

//   const handleAddToCart = (book) => {
//     setSelectedBook(book);
//     setShowPopup(true);
//   };

//   const handleQuantityChange = (e) => {
//     setQuantity(parseInt(e.target.value, 10));
//   };

//   const handleConfirmAddToCart = () => {
//     fetch("http://localhost:3000/users/add-to-cart", {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         bookId: selectedBook._id,
//         quantity: quantity,
//       }),
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then(() => {
//         setShowPopup(false);
//         setQuantity(1);
//         toast.success("Book added to cart successfully!"); // Show success message
//       })
//       .catch((error) => {
//         console.error("Error adding to cart:", error);
//         toast.error("Failed to add book to cart."); // Show error message
//       });
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//     setQuantity(1);
//   };

//   return (
//     <div className="mt-12 px-4 lg:px-24">
//       <div className="text-center mb-8">
//         <h2 className="text-6xl font-bold">All Books are here</h2>
//         <div className="mt-8 flex justify-center space-x-4">
//           <input
//             type="text"
//             placeholder="Search books"
//             value={searchTerm}
//             onChange={handleSearch}
//             className="w-full max-w-md px-4 py-2 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <select
//             value={selectedCategory}
//             onChange={handleCategoryChange}
//             className="border border-gray-300 p-2 rounded-lg"
//           >
//             <option value="">All Categories</option>
//             {categories.map((category) => (
//               <option key={category._id} value={category.name}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {filteredBooks.map((book) => (
//           <Card
//             key={book._id}
//             className="relative overflow-hidden shadow-md rounded-lg cursor-pointer"
//             onClick={() => handleCardClick(book._id)}
//           >
//             <img
//               src={book.image}
//               alt={book.title}
//               className="h-auto object-cover w-full"
//             />
//             <div className="p-4">
//               <h5 className="text-xl font-bold mt-2 mb-2">{book.title}</h5>
//               <p className="text-sm font-medium text-gray-700 mb-1">
//                 Author: {book.author}
//               </p>
//               <p className="text-sm font-medium text-gray-700 mb-1">
//                 Category: {book.category_name}
//               </p>
//               <p className="text-sm font-medium text-gray-700 mb-1">
//                 Stock: {book.stock_quantity}
//               </p>
//               <p className="text-lg font-bold text-gray-900 mb-4">
//                 ${book.price}
//               </p>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation(); // Prevent triggering card click
//                   handleAddToCart(book);
//                 }}
//                 className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out w-full"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Popup for selecting quantity */}
//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-80">
//             <h3 className="text-xl font-bold mb-4">Add to Cart</h3>
//             <p className="mb-4">Select quantity for {selectedBook.title}:</p>
//             <input
//               type="number"
//               min="1"
//               value={quantity}
//               onChange={handleQuantityChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
//             />
//             <div className="flex justify-between">
//               <button
//                 onClick={handleConfirmAddToCart}
//                 className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
//               >
//                 Confirm
//               </button>
//               <button
//                 onClick={handleClosePopup}
//                 className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast Container */}
//       <ToastContainer />
//     </div>
//   );
// };

// export default Shop;

import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Book to add to cart
  const [quantity, setQuantity] = useState(1); // Quantity of book to add
  const [showPopup, setShowPopup] = useState(false); // Show/Hide popup
  const [minPrice, setMinPrice] = useState(""); // Minimum price filter
  const [maxPrice, setMaxPrice] = useState(""); // Maximum price filter
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/book/get-all")
      .then((res) => res.json())
      .then((data) => setBooks(data));

    fetch("http://localhost:3000/category/get-all")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const filteredBooks = books.filter((book) => {
    const price = parseFloat(book.price);
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    return (
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || book.category_name === selectedCategory) &&
      price >= min &&
      price <= max
    );
  });

  const handleCardClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleAddToCart = (book) => {
    setSelectedBook(book);
    setShowPopup(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleConfirmAddToCart = () => {
    fetch("http://localhost:3000/users/add-to-cart", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: selectedBook._id,
        quantity: quantity,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => {
        setShowPopup(false);
        setQuantity(1);
        toast.success("Book added to cart successfully!"); // Show success message
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add book to cart."); // Show error message
      });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setQuantity(1);
  };

  return (
    <div className="mt-12 px-4 lg:px-24">
      <div className="text-center mb-8">
        <h2 className="text-6xl font-bold">All Books are here</h2>
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-x-4">
          <input
            type="text"
            placeholder="Search books"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full max-w-md px-4 py-2 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 sm:mb-0"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 p-2 rounded-lg mb-4 sm:mb-0"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="border border-gray-300 p-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="border border-gray-300 p-2 rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredBooks.map((book) => (
          <Card
            key={book._id}
            className="relative overflow-hidden shadow-md rounded-lg cursor-pointer"
            onClick={() => handleCardClick(book._id)}
          >
            <img
              src={book.image}
              alt={book.title}
              className="h-auto object-cover w-full"
            />
            <div className="p-4">
              <h5 className="text-xl font-bold mt-2 mb-2">{book.title}</h5>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Author: {book.author}
              </p>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Category: {book.category_name}
              </p>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Stock: {book.stock_quantity}
              </p>
              <p className="text-lg font-bold text-gray-900 mb-4">
                ${book.price}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering card click
                  handleAddToCart(book);
                }}
                className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out w-full"
              >
                Add to Cart
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Popup for selecting quantity */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold mb-4">Add to Cart</h3>
            <p className="mb-4">Select quantity for {selectedBook.title}:</p>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleConfirmAddToCart}
                className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Confirm
              </button>
              <button
                onClick={handleClosePopup}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Shop;
