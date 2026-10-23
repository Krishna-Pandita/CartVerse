import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Signup = () => {
  const [showPassword, setshowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.password) {
      return toast.error("Please fill in all required fields");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        navigate("/verify");
        toast.success(res.data.message || "Account created! Please check your email.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-pink-100 via-pink-200 to-purple-100 min-h-screen px-4 py-8 sm:py-12">
      <Card className="w-full max-w-md shadow-xl border-white/60 bg-white/95 backdrop-blur-xs rounded-2xl">
        <CardHeader className="text-center sm:text-left pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create an Account
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Enter your details below to create your free CartVerse account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200 h-10"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200 h-10"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-50 border-gray-200 h-10"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-gray-700">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-gray-50 border-gray-200 pr-10 h-10"
                />

                <button
                  type="button"
                  onClick={() => setshowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 cursor-pointer bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Please Wait
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 pt-2 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-600 font-semibold hover:underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
