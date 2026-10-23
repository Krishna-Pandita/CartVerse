import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Package, Calendar, Clock, User, Mail } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL ||
          import.meta.env.VITE_URL ||
          "http://localhost:5000";

        const { data } = await axios.get(
          `${backendUrl}/api/v1/orders/all`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="md:pl-72 lg:pl-80 flex items-center justify-center min-h-[60vh] w-full">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="md:pl-72 lg:pl-80 px-4 sm:px-6 md:pr-8 pt-32 sm:pt-36 md:pt-28 pb-16 min-h-screen bg-gray-50/70 w-full">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            View and manage all customer purchases across CartVerse ({orders.length} total)
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center shadow-2xs">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-800">No orders yet</h3>
            <p className="text-gray-500 text-xs mt-1">
              Customer orders will show up here as soon as they complete checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Header: Order ID + Status + Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                      Order ID
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-semibold text-gray-800 break-all">
                      {order._id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-bold text-base sm:text-lg text-gray-900">
                      ₹{Number(order.amount || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="py-3 text-xs sm:text-sm text-gray-600 border-b border-gray-50 flex flex-wrap gap-x-6 gap-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>
                      <strong>Customer:</strong> {order.user?.firstName || "Guest"}{" "}
                      {order.user?.lastName || ""}
                    </span>
                  </div>
                  {order.user?.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{order.user.email}</span>
                    </div>
                  )}
                  {order.createdAt && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Products */}
                <div className="mt-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Ordered Products ({order.products?.length || 0})
                  </h3>

                  <div className="space-y-2">
                    {order.products?.map((product, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50/60"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={
                              product.productId?.productImg?.[0]?.url ||
                              "/placeholder.png"
                            }
                            alt=""
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 shrink-0 bg-white"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug">
                              {product.productId?.productName || "Product"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">
                              ID: {product.productId?._id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs sm:text-sm font-semibold text-gray-800 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-200/50">
                          <span className="text-gray-500 font-normal">
                            Qty: {product.quantity}
                          </span>
                          <span className="text-pink-600 font-bold">
                            ₹
                            {Number(
                              product.productId?.productPrice || 0
                            ).toLocaleString("en-IN")}{" "}
                            each
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;