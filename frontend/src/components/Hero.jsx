import React from "react";
import mobileicon from "../assets/mobileicon.png";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600  text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          <div>
            <h1 className="text-4xl md:text-6xl mb-4 font-bold">
              Latest Electronics at Best Prices
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              Discover cutting-edge technology with unbeatable deals on
              smartphones, laptops, and more.
            </p>
            <div className="flex gap-4 flex-4 sm:flex-row">
              <Button className="bg-white text-blue-600 hover:bg-gray-200 cursor-pointer">
                Shop Now
              </Button>
              <Button variant="outline" className="border-white text-white hover:text-blue-600 hover:bg-white cursor-pointer bg-transparent">
              View Deals
              </Button>
            </div>
          </div>

<div className="relative">
  <img src={mobileicon} alt="Electronics" className="rounded-lg " />
</div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
