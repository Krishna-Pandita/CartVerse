import React from "react";
import mobileicon from "../assets/mobileicon.png";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 font-bold tracking-tight leading-tight">
              Latest Electronics at Best Prices
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 text-blue-100 max-w-xl mx-auto md:mx-0">
              Discover cutting-edge technology with unbeatable deals on
              smartphones, laptops, and more.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
              <span className="text-sm sm:text-base font-medium text-blue-100">
                Discover More
              </span>

              <Button
                onClick={() => navigate("/products")}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <img
              src={mobileicon}
              alt="Electronics"
              className="rounded-lg max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
