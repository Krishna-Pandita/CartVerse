import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, Package, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrder = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl cursor-pointer h-9 w-9 border-gray-300"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your Orders</h1>
      </div>

      {userOrder.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center my-6 shadow-2xs">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            You haven't placed any orders yet
          </h2>
          <p className="text-gray-500 text-sm mt-1 mb-5">
            When you purchase items, they will appear here.
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-5 py-2 rounded-lg cursor-pointer text-sm"
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-5 w-full">
          {userOrder.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 bg-white rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-sm transition-shadow"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                    Order ID
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-gray-800 font-semibold break-all">
                    {order._id}
                  </span>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      order.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="font-bold text-base sm:text-lg text-gray-900">
                    {order.currency || "₹"}{" "}
                    {Number(order.amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* User Info (if admin or present) */}
              {(order.user?.firstName || order.user?.email) && (
                <div className="py-2.5 text-xs text-gray-500 border-b border-gray-50 flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    Customer: <strong className="text-gray-700">{order.user?.firstName} {order.user?.lastName}</strong>
                  </span>
                  {order.user?.email && <span>Email: {order.user.email}</span>}
                  {order.createdAt && (
                    <span>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}

              {/* Products List */}
              <div className="pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Items ({order.products?.length || 0})
                </h3>

                <ul className="space-y-2.5">
                  {order.products?.map((item, idx) => {
                    const prod = item?.productId;
                    if (!prod) return null;

                    return (
                      <li
                        key={prod._id || idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-xl gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            onClick={() => navigate(`/products/${prod._id}`)}
                            src={prod.productImg?.[0]?.url || "/placeholder.png"}
                            alt={prod.productName || "Product"}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 cursor-pointer shrink-0 bg-white"
                          />
                          <div className="min-w-0 flex-1">
                            <h4
                              onClick={() => navigate(`/products/${prod._id}`)}
                              className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-pink-600 cursor-pointer leading-snug"
                            >
                              {prod.productName}
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5 truncate font-mono">
                              ID: {prod._id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60 font-semibold text-gray-800 shrink-0">
                          <span className="text-gray-500 font-normal">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-pink-600 font-bold">
                            ₹{Number(prod.productPrice || 0).toLocaleString("en-IN")} each
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
