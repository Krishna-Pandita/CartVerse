import OrderCard from "@/components/OrderCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ShowUserOrders = () => {
  const [userOrder, setUserOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const getUserOrders = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_URL ||
        "http://localhost:5000";

      const res = await axios.get(
        `${backendUrl}/api/v1/orders/user-order/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setUserOrder(res.data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="md:pl-72 lg:pl-80 flex items-center justify-center min-h-[60vh] w-full">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="md:pl-72 lg:pl-80 px-4 sm:px-6 md:pr-8 pt-32 sm:pt-36 md:pt-28 pb-16 min-h-screen bg-gray-50/70 w-full">
      <OrderCard userOrder={userOrder} />
    </div>
  );
};

export default ShowUserOrders;