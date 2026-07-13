import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">

        <div className="flex justify-center">
          <CheckCircle className="h-17 w-17 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mt-6">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-2">
          Thank you for your Purchase.
          Your payment has been received successfully.
        </p>



        <div className="mt-6 flex flex-col gap-3">
          <button onClick={()=>navigate("/products")}
            className=" cursor-pointer w-full bg-pink-600 text-white py-2 rounded-xl hover:bg-pink-700 transition"
            >
            Continue Shopping
            </button>




{/* 
         <button
         onClick={()=>navigate("/orders")}
         className="w-full border border-pink-600 text-pink-600 py-2 rounded-xl hover:bg-pink-50 transition">
          View My Orders
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;