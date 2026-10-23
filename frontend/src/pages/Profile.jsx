import React, { useState } from "react";
import profile from "../assets/profile.png";
import { setUser } from "../redux/userSlice";
import { Loader2, Camera, User, ShoppingBag } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import MyOrder from "./MyOrder";

const Profile = () => {
  const { user } = useSelector((store) => store.user);

  const params = useParams();
  const userId = params.userId;
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUpdateUser({
        ...updateUser,
        profilePic: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phone);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/user/update/${userId}`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
        dispatch(setUser(data.user));
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 min-h-screen bg-gray-50/70 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="Profile" className="w-full">
          {/* Responsive Tabs Header */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <TabsList className="bg-white border border-gray-200 p-1 rounded-xl shadow-2xs">
              <TabsTrigger
                value="Profile"
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                <User className="w-4 h-4" />
                Profile Info
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                <ShoppingBag className="w-4 h-4" />
                My Orders
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="Profile">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">
                Personal Information
              </h2>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative group">
                    <img
                      src={updateUser.profilePic || profile}
                      alt="Profile"
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-pink-500 shadow-md bg-white"
                    />
                    <label
                      htmlFor="profile-pic-upload"
                      className="absolute bottom-1 right-1 bg-pink-600 text-white p-2 rounded-full cursor-pointer hover:bg-pink-700 shadow-md transition-all"
                      title="Upload new picture"
                    >
                      <Camera className="w-4 h-4" />
                      <input
                        id="profile-pic-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <span className="text-xs text-gray-400 mt-2 font-medium">
                    Allowed JPG, PNG or WEBP
                  </span>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">
                        First Name
                      </Label>
                      <Input
                        type="text"
                        name="firstName"
                        value={updateUser.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        name="lastName"
                        value={updateUser.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={updateUser.email}
                      disabled
                      className="mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={updateUser.phone}
                      onChange={handleChange}
                      placeholder="+91 9419123789"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-700">
                      Street Address
                    </Label>
                    <Input
                      type="text"
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                      placeholder="123 Street, City"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold text-gray-700">
                        City
                      </Label>
                      <Input
                        type="text"
                        name="city"
                        value={updateUser.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold text-gray-700">
                        Zip / Postal Code
                      </Label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={updateUser.zipCode}
                        onChange={handleChange}
                        placeholder="400001"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg mt-6 cursor-pointer shadow-md transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <MyOrder />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
