import React from "react";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 sm:pt-28 min-h-screen flex items-center justify-center bg-gray-50/70 px-4 py-10">
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 sm:p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-5">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">
          Thank you for shopping with CartVerse! Your payment has been received and your order is being processed.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={() => navigate("/products")}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl transition cursor-pointer"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;