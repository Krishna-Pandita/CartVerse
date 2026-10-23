import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Camera } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profile from "../../assets/profile.png";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const UserInfo = () => {
  const navigate = useNavigate();
  const [updateUser, setUpdateUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [file, setFile] = useState(null);
  const params = useParams();
  const userId = params.id;
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
      formData.append("firstName", updateUser.firstName || "");
      formData.append("lastName", updateUser.lastName || "");
      formData.append("email", updateUser.email || "");
      formData.append("phoneNo", updateUser.phoneNo || "");
      formData.append("address", updateUser.address || "");
      formData.append("city", updateUser.city || "");
      formData.append("zipCode", updateUser.zipCode || "");
      formData.append("role", updateUser.role || "user");

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
        toast.success(data.message || "User profile updated");
        dispatch(setUser(data.user));
        navigate("/dashboard/users");
      } else {
        toast.error(data.message || "Failed to update user profile");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      setFetching(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/user/get-user/${userId}`
      );
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load user details");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [userId]);

  if (fetching) {
    return (
      <div className="md:pl-72 lg:pl-80 flex items-center justify-center min-h-[60vh] w-full">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="md:pl-72 lg:pl-80 px-4 sm:px-6 md:pr-8 pt-32 sm:pt-36 md:pt-28 pb-16 min-h-screen bg-gray-50/70 w-full">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl cursor-pointer h-9 w-9 border-gray-300"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Edit User Profile
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 sm:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative group">
                <img
                  src={updateUser?.profilePic || profile}
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-pink-500 shadow-md bg-white"
                />
                <label
                  htmlFor="user-pic-upload"
                  className="absolute bottom-1 right-1 bg-pink-600 text-white p-2 rounded-full cursor-pointer hover:bg-pink-700 shadow-md transition-all"
                  title="Change picture"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="user-pic-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <span className="text-xs text-gray-400 mt-2">Avatar Preview</span>
            </div>

            {/* User Edit Form */}
            <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-700">
                    First Name
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={updateUser?.firstName || ""}
                    onChange={handleChange}
                    placeholder="Joe"
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
                    value={updateUser?.lastName || ""}
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
                  value={updateUser?.email || ""}
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
                  name="phoneNo"
                  value={updateUser?.phoneNo || ""}
                  onChange={handleChange}
                  placeholder="+91 9419123789"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-gray-700">
                  Address
                </Label>
                <Input
                  type="text"
                  name="address"
                  value={updateUser?.address || ""}
                  onChange={handleChange}
                  placeholder="Street Address"
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
                    value={updateUser?.city || ""}
                    onChange={handleChange}
                    placeholder="City"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700">
                    Zip Code
                  </Label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={updateUser?.zipCode || ""}
                    onChange={handleChange}
                    placeholder="Zip Code"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Role Radio Group */}
              <div className="pt-2">
                <Label className="text-xs font-semibold text-gray-700 block mb-2">
                  Account Role
                </Label>

                <RadioGroup
                  value={updateUser?.role || "user"}
                  onValueChange={(value) =>
                    setUpdateUser({ ...updateUser, role: value })
                  }
                  className="flex flex-row gap-6 items-center"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user-role" />
                    <Label htmlFor="user-role" className="text-sm font-medium cursor-pointer">
                      User
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin-role" />
                    <Label htmlFor="admin-role" className="text-sm font-medium cursor-pointer">
                      Admin
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer shadow-md transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save User Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
