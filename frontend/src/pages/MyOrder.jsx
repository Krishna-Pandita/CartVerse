import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "@/components/OrderCard";

const MyOrder = () => {
  const [userOrder, setUserOrder] = useState([]);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
  <>
  <OrderCard userOrder={userOrder} />
  </>
  );
};

export default MyOrder;
