import React from "react";
import { useLoaderData } from "react-router-dom";

const SingleBook = () => {
  const {
    _id,
    title,
    author,
    price,
    publisher,
    description,
    stock_quantity,
    image,
    category_name,
    is_active,
    reviews,
  } = useLoaderData();
  return (
    <div className="mt-28 px-4 lg:px-24">
      <img src={image} alt="" className="h-96" />
      <h2>{title}</h2>
    </div>
  );
};

export default SingleBook;
