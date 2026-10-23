import React from "react";
import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Verify() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-purple-100 px-4 py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-md text-center border border-white/60">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <MailCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Check Your Email
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          We've sent a verification link to your email address. Please check your
          inbox (and spam folder) and click the link to activate your CartVerse
          account.
        </p>
        <Link to="/login">
          <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 rounded-lg cursor-pointer">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Verify;
