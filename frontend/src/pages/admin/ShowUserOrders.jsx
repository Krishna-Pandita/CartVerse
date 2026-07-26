import OrderCard from "@/components/OrderCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowUserOrders = () => {
  const [userOrder, setUserOrder] = useState([]);
  const { userId } = useParams();

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setUserOrder(res.data.orders);
      // or setUserOrder(res.data.orders); depending on your API
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, [userId]);

  return (
    <div className="pl-[350px] py-26">
      <OrderCard userOrder={userOrder} />
    </div>
  );
};

export default ShowUserOrders;