import React from "react";
import { Truck, ShieldCheck, Star, Users, Package, Headphones } from "lucide-react";

const About = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 pt-24 sm:pt-28 md:pt-32 pb-16 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
              About <span className="text-pink-300">CartVerse</span>
            </h1>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-4">
              Welcome to CartVerse, your trusted online shopping destination.
              We bring together quality products, affordable prices, and a
              seamless shopping experience—all in one place.
            </p>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-4">
              Whether you're looking for electronics, modern tech, or daily
              essentials, CartVerse offers a carefully curated collection to
              meet your lifestyle needs.
            </p>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
              Our goal is to make online shopping simple, secure, and enjoyable
              through fast delivery, secure payments, and 24/7 dedicated customer
              support.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
              alt="Shopping at CartVerse"
              className="rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg object-cover aspect-4/3"
              loading="lazy"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-14 sm:mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-center border border-white/20 transition duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">10K+</div>
            <p className="text-sm sm:text-base text-blue-100 font-medium">Happy Customers</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-center border border-white/20 transition duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">500+</div>
            <p className="text-sm sm:text-base text-blue-100 font-medium">Quality Products</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-center border border-white/20 transition duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">24/7</div>
            <p className="text-sm sm:text-base text-blue-100 font-medium">Customer Support</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 sm:mt-24 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 sm:mb-12">
            Why Choose CartVerse?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white text-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Fast & Free Delivery</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get your orders delivered safely and promptly right to your doorstep.
              </p>
            </div>

            <div className="bg-white text-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Shop with confidence using trusted, end-to-end encrypted checkout.
              </p>
            </div>

            <div className="bg-white text-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every product is checked and curated to ensure top-notch performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;