import React from "react";
import { assets } from "../assets/assets";
import Hero from "../components/Hero";
import BestSellers from "../components/BestSellers";
import LatestCollection from "../components/LatestCollection";
const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <BestSellers />
      <LatestCollection />
    </div>
  );
};

export default Home;
