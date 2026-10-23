import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email address, please wait...");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/user/verify/${token}`
      );

      if (res.data.success) {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else {
        setStatus("error");
        setMessage(res.data.message || "Verification failed. The link may have expired.");
      }
    } catch (error) {
      console.log("Verification Error:", error);
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Verification link is invalid or has expired."
      );
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-purple-100 px-4 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-md text-center border border-white/60">
        {status === "verifying" && (
          <div>
            <Loader2 className="w-12 h-12 text-pink-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Verifying Email...
            </h2>
            <p className="text-gray-500 text-sm">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <p className="text-xs text-gray-400">Redirecting to login in a moment...</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <Link to="/signup">
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 rounded-lg cursor-pointer">
                Back to Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;