import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

const BestSellerBook = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/book/get-all")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.log(err.message));
  }, []);
  return (
    <div>
      <BookCard books={books} headline="Best Seller Books" />
    </div>
  );
};

export default BestSellerBook;
