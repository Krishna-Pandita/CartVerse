import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setstatus] = useState("Verifying...");
  const navigate = useNavigate();

  const veryfyEmail = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/user/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        setstatus("✅ Email Verified Successfully.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
        console.log(error);
      setstatus("❌ verification failed. Please try again.");
    }
  };

  useEffect(() => {
    veryfyEmail();
  }, [token]);

  return (
    <div className="relative w-full h-[760px] bg-pink-100 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
          <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
