import React from "react";
import Banner from "../components/Banner";
import BestSellerBook from "./BestSellerBook";
import FavBook from "./FavBook";

const Home = () => {
  return (
    <div>
      <Banner />
      <BestSellerBook />
      <FavBook />
    </div>
  );
};

export default Home;
