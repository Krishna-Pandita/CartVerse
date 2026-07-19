import React, { useState } from "react";
import IMG from "../assets/IMG-20250629-WA0000 - Copy.jpg";
import profile from "../assets/profile.png";
import { setUser } from "../redux/userSlice";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import MyOrder from "./MyOrder";

const Profile = () => {
  const { user } = useSelector((store) => store.user);

  const params = useParams();
  const userId = params.userId; // Assuming the route is defined as /profile/:id
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
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
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading

const accessToken = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phone); // changed
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(
        `http://localhost:5000/api/v1/user/update/${userId}`,
        {
          method: "PUT",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUser(data.user));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="pt-23 min-h-screen bg-gray-100">
      <Tabs defaultValue="Profile" className="max-w-7xl mx-auto items-center">
        <TabsList className="gap-5">
          <TabsTrigger value="Profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="Profile">
          <div>
            <div className="flex flex-col items-center bg-gray-100 justify-center">
              <h1 className="text-2xl font-bold mb-7 text-gray-800">
                Update Profile
              </h1>
              <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                {/* Profile update form would go here */}
                <div className="flex items-center flex-col">
                  <img
                    src={updateUser.profilePic || profile}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-pink-800"
                  />

                  {/* <img
                    src={profile}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-pink-800"
                  /> */}

                  <label className=" w-[150px] mt-2 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                    Change Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {/* profile form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 shadow-lg p-5 rounded-lg bg-white "
                >
                  <div className="grid grid-cols-2 gap-4 w-[420px]">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name:
                      </label>
                      <Input
                        type="text"
                        name="firstName"
                        value={updateUser.firstName}
                        onChange={handleChange}
                        placeholder="Joe"
                        className="w-fulll border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name:
                      </label>
                      <Input
                        type="text"
                        name="lastName"
                        value={updateUser.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-fulll border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email:
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={updateUser.email}
                      onChange={handleChange}
                      disabled
                      className="w-fulll border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number:
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={updateUser.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-fulll border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address:
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="w-fulll border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City:
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={updateUser.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className="w-fulll border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Zip Code:
                    </label>
                    <Input
                      type="text"
                      name="zipCode"
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      placeholder="Enter your zip code"
                      className="w-fulll border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-pink-600 text-white hover:bg-pink-700 w-full py-2 rounded-lg mt-4 font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
               <MyOrder />
        </TabsContent>


        {/* <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                View your key metrics and recent project activity. Track
                progress across all your active projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You have 12 active projects and 3 pending tasks.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Track performance and user engagement metrics. Monitor trends
                and identify growth opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Page views are up 25% compared to last month.
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Profile;
