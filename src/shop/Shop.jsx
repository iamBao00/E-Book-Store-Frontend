import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";

const Shop = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/book/get-all")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);
  return (
    <div className="mt-12 px-4 lg:px-24">
      <h2 className="text-4xl font-bold text-center mb-8">
        All Books are here
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <Card
            key={book.id}
            className="relative overflow-hidden shadow-md rounded-lg"
          >
            <img
              src={book.image}
              alt={book.title}
              className="h-auto object-cover w-full"
            />
            <div className="p-4">
              <h5 className="text-xl font-bold mt-2 mb-2">{book.title}</h5>
              <p className="text-gray-700 mb-4">{book.description}</p>
              <button className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out w-full">
                Add to Cart
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shop;
