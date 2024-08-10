import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";

const SingleBook = () => {
  const book = useLoaderData();
  const [review, setReview] = useState({ rating: 1, comment: "" });
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [editingReview, setEditingReview] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Show/Hide popup
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin người dùng từ Local Storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Kiểm tra xem người dùng đã để lại đánh giá hay chưa
  const userHasReviewed = currentUser
    ? book.reviews.some((review) => review.user_id._id === currentUser._id)
    : false;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingReview ? "PATCH" : "POST";
      const response = await fetch(
        `http://localhost:3000/book/review/${book._id}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            rating: review.rating,
            comment: review.comment,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login", { state: { error: "You need to login first" } });
          return;
        }
        throw new Error("Failed to submit review.");
      }

      const updatedBook = await response.json();
      window.location.reload();
      setReview({ rating: 1, comment: "" });
      setShowReviewForm(false);
      setEditingReview(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditReview = (userReview) => {
    setReview({ rating: userReview.rating, comment: userReview.comment });
    setShowReviewForm(true);
    setEditingReview(true);
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/book/review/${book._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login", { state: { error: "You need to login first" } });
          return;
        }
        throw new Error("Failed to delete review.");
      }

      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating(book.reviews);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-pointer ${
            i <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => setReview({ ...review, rating: i })}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    setShowPopup(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleConfirmAddToCart = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/add-to-cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
          quantity: quantity,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login", { state: { error: "You need to login first" } });
          return;
        }
        throw new Error("Failed to add book to cart.");
      }

      const data = await response.json();
      setShowPopup(false);
      setQuantity(1);
      toast.success("Book added to cart successfully!"); // Show success message
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add book to cart."); // Show error message
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setQuantity(1);
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row items-center lg:items-start">
        <img
          src={book.image}
          alt={book.title}
          className="w-64 h-auto object-cover mr-8"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
          <p className="text-gray-700 mb-2">By {book.author}</p>
          <div className="flex items-center mb-4">
            <span>{renderStars(averageRating)}</span>
            <span className="ml-2 text-gray-600">
              ({book.reviews.length} reviews)
            </span>
          </div>
          <p className="text-2xl text-red-500 font-bold mb-4">{book.price} $</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          {currentUser && !userHasReviewed && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
              onClick={() => setShowReviewForm(true)}
            >
              Leave a Review
            </button>
          )}
          {currentUser && userHasReviewed && (
            <div className="mt-5 flex">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() =>
                  handleEditReview(
                    book.reviews.find(
                      (review) => review.user_id._id === currentUser._id
                    )
                  )
                }
              >
                Edit My Review
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded ml-4"
                onClick={handleDeleteReview}
              >
                Delete My Review
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Description</h3>
        <p className="text-gray-700 mb-4">{book.description}</p>
      </div>
      {showReviewForm && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">
            {editingReview ? "Edit Review" : "Leave a Review"}
          </h3>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleReviewSubmit} className="flex flex-col">
            <label className="mb-2">
              Rating:
              <div className="flex ml-2">{renderStars(review.rating)}</div>
            </label>
            <label className="mb-2">
              Comment:
              <textarea
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                className="border p-2 rounded w-full h-24 mt-2"
              />
            </label>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            >
              {editingReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </div>
      )}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Reviews</h3>
        {book.reviews.length > 0 ? (
          book.reviews.map((review, index) => (
            <div key={index} className="border-t pt-4 mt-4">
              <div className="flex items-center">
                <span>{renderStars(review.rating)}</span>
                <span className="ml-2 text-gray-600">
                  {review.rating} stars
                </span>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
              <p className="text-gray-700 font-bold text-sm mt-1">
                {review.user_id.username} -{" "}
                {new Date(review.review_date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No reviews yet.</p>
        )}
      </div>
      {/* Popup for selecting quantity */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold mb-4">Add to Cart</h3>
            <p className="mb-4">Select quantity for {book.title}:</p>
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
      <ToastContainer />
    </div>
  );
};

export default SingleBook;
