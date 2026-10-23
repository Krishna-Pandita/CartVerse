import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "@/components/OrderCard";
import { Loader2 } from "lucide-react";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserOrders = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_URL ||
        "http://localhost:5000";

      const res = await axios.get(`${backendUrl}/api/v1/orders/myorder`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return <OrderCard userOrder={userOrder} />;
};

export default MyOrder;
