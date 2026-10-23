import React, { useState } from "react";
import { Button } from "./button";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ShoppingCart, Check, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDesc = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    if (!accessToken) {
      navigate("/login");
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/cart/add`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full">
      {/* Category & Brand Badges */}
      <div className="flex flex-wrap gap-2 items-center">
        {product.category && (
          <span className="bg-pink-50 text-pink-700 font-semibold px-3 py-1 rounded-full text-xs">
            {product.category}
          </span>
        )}
        {product.brand && (
          <span className="bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full text-xs uppercase tracking-wide">
            {product.brand}
          </span>
        )}
      </div>

      {/* Product Name */}
      <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight">
        {product.productName}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <h2 className="text-pink-600 text-2xl sm:text-3xl font-extrabold">
          ₹{Number(product.productPrice || 0).toLocaleString("en-IN")}
        </h2>
        <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
          In Stock
        </span>
      </div>

      {/* Description */}
      <div className="border-t border-b border-gray-100 py-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Description
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {product.productDesc || "No description provided."}
        </p>
      </div>

      {/* Quantity & Add to Cart Action */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 text-sm font-semibold">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer font-bold text-sm"
            >
              -
            </button>
            <span className="px-3 py-1.5 font-semibold text-sm min-w-8 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer font-bold text-sm"
            >
              +
            </button>
          </div>
        </div>

        <Button
          onClick={() => addToCart(product._id)}
          disabled={loading}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all flex-1 sm:flex-initial"
        >
          <ShoppingCart className="w-4 h-4" />
          {loading ? "Adding..." : "Add To Cart"}
        </Button>
      </div>

      {/* Service Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-pink-600 shrink-0" />
          <span>Free delivery over ₹299</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-pink-600 shrink-0" />
          <span>7-day return policy</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-pink-600 shrink-0" />
          <span>100% Genuine product</span>
        </div>
      </div>
    </div>
  );
};

export default ProductDesc;