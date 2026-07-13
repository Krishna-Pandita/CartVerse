import React from "react";

const About = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-200">
              About <span className="text-white">CartVerse</span>
            </h1>

            <p className="text-white text-lg leading-8 mb-6 pt-10 font-semibold">
              Welcome to CartVerse, your trusted online shopping destination.
              We bring together quality products, affordable prices, and a
              seamless shopping experience—all in one place.
            </p>

            <p className="text-white  text-lg leading-8 mb-6 font-semibold">
              Whether you're looking for electronics, fashion, home essentials,
              or everyday products, CartVerse offers a carefully curated
              collection to meet your needs.
            </p>

            <p className="text-white  text-lg leading-8 font-semibold">
              Our goal is to make online shopping simple, secure, and enjoyable
              through fast delivery, secure payments, and excellent customer
              support.
            </p>
          </div>

          {/* Right Image */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
              alt="Shopping"
              className="rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition duration-300">
            <h2 className="text-4xl font-bold text-blue-600">10K+</h2>
            <p className="mt-3 text-gray-600">Happy Customers</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition duration-300">
            <h2 className="text-4xl font-bold text-blue-600">500+</h2>
            <p className="mt-3 text-gray-600">Quality Products</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition duration-300">
            <h2 className="text-4xl font-bold text-blue-600">24/7</h2>
            <p className="mt-3 text-gray-600">Customer Support</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-10">
            Why Choose CartVerse?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your orders delivered quickly and safely to your doorstep.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Shop confidently with trusted and secure payment methods.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                We carefully select products to ensure the best quality and
                value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;