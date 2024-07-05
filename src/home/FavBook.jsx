import React from "react";
import FavBookImg from "../assets/favoritebook.jpg";
import { Link } from "react-router-dom";

const FavBook = () => {
  return (
    <div className="px-4 lg:px-24 my-20 flex flex-col md:flex-row justify-between items-center gap-12">
      <div className="md:w-1/2">
        <img src={FavBookImg} alt="" className="rounded md:w-10/12" />
      </div>

      {/*Stats */}
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-5x1 font-bold my-5 md:w-3/4 leading-snug">
          Find Your Favourite <span className="text-blue-700">Book Here!</span>
        </h2>
        <p className="mb-10 text-lg md:w-5/6">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam
          dolorem obcaecati repudiandae quae molestias quaerat tenetur facilis
          nostrum et animi perspiciatis, unde atque iure. Quam quisquam
          voluptatem corrupti eum nemo?
        </p>
        <div className="flex flex-col sm:flex-row justify-between gap-6 md:w-3/4 my-14">
          <div>
            <h3 className="text-3xl font-bold">500+</h3>
            <p className="text-base">Book Listing</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">100+</h3>
            <p className="text-base">Register User</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">1000+</h3>
            <p className="text-base">Visited</p>
          </div>
        </div>

        {/*Button */}
        <Link to="/shop" className="mt-12 block">
          <button className="bg-blue-700 text-white font-semibold px-5 py-2 rounded hover:bg-black transition-all duration-300">
            Explore More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FavBook;
