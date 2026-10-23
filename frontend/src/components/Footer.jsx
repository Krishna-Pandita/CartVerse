import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand Section */}
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">CartVerse</h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Your one-stop destination for fashion, electronics, and daily essentials.
            Shop smart, live better.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Shop Products</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">My Cart</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping and Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-3">Stay in the Loop</h3>
          <p className="text-sm text-gray-400 mb-3 leading-relaxed">
            Subscribe to get special offers, free giveaways, and deals.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-3 py-2 rounded-md sm:rounded-r-none sm:rounded-l bg-gray-800 text-white placeholder-gray-500 border border-gray-700 outline-none focus:border-pink-500 text-sm"
            />
            <button
              type="submit"
              className="bg-pink-600 px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r text-white hover:bg-pink-700 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} CartVerse. All rights reserved.</p>

          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}