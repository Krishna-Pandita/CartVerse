import React from "react";
import { Button } from "./button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./skeleton";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product || {};
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
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product added to Cart");
        dispatch(setCart(res.data.cart));
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to cart";
      toast.error(msg);
      console.error("Add to cart error:", msg);
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all rounded-xl overflow-hidden flex flex-col h-full p-2.5 sm:p-3.5 md:p-4 w-full">
      <div
        onClick={() => product?._id && navigate(`/products/${product._id}`)}
        className="w-full aspect-square overflow-hidden rounded-lg bg-gray-50 relative group cursor-pointer"
      >
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <img
            src={productImg?.[0]?.url || "/placeholder.png"}
            alt={productName || "Product"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}
      </div>

      {loading ? (
        <div className="space-y-2 mt-3 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>
          <Skeleton className="w-1/3 h-5" />
          <Skeleton className="w-full h-9 rounded-lg" />
        </div>
      ) : (
        <div className="pt-2.5 sm:pt-3 flex-1 flex flex-col justify-between">
          <div>
            <h2
              onClick={() => product?._id && navigate(`/products/${product._id}`)}
              className="font-medium text-xs sm:text-sm md:text-base text-gray-800 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] hover:text-pink-600 transition-colors cursor-pointer leading-snug"
              title={productName}
            >
              {productName}
            </h2>
            <div className="font-bold text-sm sm:text-base text-gray-900 mt-1 mb-2.5 sm:mb-3">
              ₹{Number(productPrice || 0).toLocaleString("en-IN")}
            </div>
          </div>

          <Button
            onClick={() => addToCart(product._id)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer mt-auto transition-colors font-medium shadow-2xs"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Add to Cart</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
