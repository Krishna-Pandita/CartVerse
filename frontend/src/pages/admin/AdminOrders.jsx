import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/orders/all`,
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
        console.error("❌ Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);


 if (loading) {
  return (
    <div className="flex items-center justify-center h-screen pl-[20%]">
      <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
    </div>
  );
}

  return (
    <div className="pl-[350px] py-20 pr-20 mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 py-5">Admin All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl shadow-md p-5 bg-white"
            >
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold">
                  Order ID: {order._id}
                </h2>

                <span
                  className={`px-3 py-1 rounded-xl text-white ${
                    order.status === "Paid"
                      ? "bg-green-600"
                      : "bg-red-400"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p>
                <strong>User:</strong>{" "}
                {order.user?.firstName} {order.user?.lastName}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {order.user?.email}
              </p>

              <p>
                <strong>Amount:</strong> ₹
                {Number(order.amount || 0).toFixed(2)}
              </p>

              <p>
                <strong>Currency:</strong> {order.currency}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Products</h3>

                {order.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border rounded-lg p-3 mb-2"
                  >
                    <img
                      src={product.productId?.productImg?.[0]?.url}
                      alt={""}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div>
                      <p className="font-medium">
                        {product.productId?.productName}
                      </p>

                      <p>
                        Price: ₹
                        {product.productId?.productPrice}
                      </p>

                      <p>
                        Quantity: {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Ordered on:{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;