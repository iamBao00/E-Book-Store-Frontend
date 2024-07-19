import React from "react";
import { useLoaderData } from "react-router-dom";

const SingleBook = () => {
  const book = useLoaderData();
  console.log(book);
  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-4xl font-bold mb-4">{book.title}</h2>
      <div className="flex">
        <img
          src={book.image}
          alt={book.title}
          className="w-64 h-auto object-cover mr-8"
        />
        <div>
          <p className="text-lg font-bold mb-2">Author: {book.author}</p>
          <p className="text-lg mb-2">Category: {book.category_name}</p>
          <p className="text-lg mb-2">Price: ${book.price}</p>
          <p className="text-lg mb-4">Stock: {book.stock_quantity}</p>
          <p className="text-base mb-4">{book.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
