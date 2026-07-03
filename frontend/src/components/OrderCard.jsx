import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();

  return (
    <div className=" pr-20 flex flex-col gap-3">
      <div className="w-full p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Orders</h1>
        </div>

        {userOrder.length === 0 ? (
          <p className="text-gray-800 text-2xl">
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="space-y-4 w-full">
            {userOrder.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-2xl p-5 shadow-lg"
              >
                {/* Order header */}

                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    Order ID: {order._id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Amount:{" "}
                    <span className="font-bold">
                      {order.currency} {Number(order.amount || 0).toFixed(2)}
                    </span>
                  </p>
                </div>

                {/* User Information */}

                <div className="mb-4  ">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">User:</span>{" "}
                    {order.user?.firstName || "Unknown"}{" "}
                    {order.user?.lastName || ""}
                  </p>

                  <p className="text-sm text-gray-500">
                    Email: {order.user?.email || "N/A"}
                  </p>

                  <div className="flex justify-end items-center">
                    <span
                      className={`px-3 py-1 rounded-xl text-white ${
                        order.status === "Paid"
                          ? "bg-green-800 text-white"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="bg-white">
                  <h3 className="font-medium my-2 py-2 px-2">Products </h3>
                  <ul className="space-y-2">
                    {order.products.map((product, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between
                             p-3 bg-gray50 rounded-xl gap-3"
                      >
                        <img
                          onClick={() =>
                            navigate(`/products/${product?.productId?._id}`)
                          }
                          src={product.productId?.productImg?.[0].url}
                          alt={product.productId.name}
                          className="w-16 cursor-pointer"
                        />
                        <span className="w-[300px] line-clamp-2">
                          {product.productId?.productName}
                        </span>
                        <span className="w-[300px] line-clamp-2">
                          {product?.productId?._id}
                        </span>

                        <span className="font-medium">
                          ₹{product.productId?.productPrice?.toFixed(2)} x{" "}
                          {product.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
