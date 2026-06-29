import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profile from "../../assets/profile.png";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const UserInfo = () => {
  const navigate = useNavigate();
  const [updateUser, setUpdateUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.id;
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
     formData.append("phoneNo", updateUser.phoneNo); // changed
      formData.append("address", updateUser.address || "");
      formData.append("city", updateUser.city || "");
      formData.append("zipCode", updateUser.zipCode || "");
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

  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/user/get-user/${userId}`,
      );
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="pt-10 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="flex justify-between gap-2">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>

          <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
            {/* Profile update form would go here */}
            <div className="flex items-center flex-col">
              <img
                src={updateUser?.profilePic || profile}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-pink-800"
              />

              {/* <img
                    src={profile}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-pink-800"
                  /> */}

              <Label className=" w-[150px] mt-2 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
            {/* profile form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 shadow-lg p-5 rounded-lg bg-white "
            >
              <div className="grid grid-cols-2 gap-4 w-[420px]">
                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    First Name:
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={updateUser?.firstName || ""}
                    onChange={handleChange}
                    placeholder="Joe"
                    className="w-fulll border rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700">
                    Last Name:
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={updateUser?.lastName || ""}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-fulll border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Email:
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={updateUser?.email || ""}
                  onChange={handleChange}
                  disabled
                  className="w-fulll border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Phone Number:
                </Label>
                <Input
                  type="tel"
                 name="phoneNo"
value={updateUser?.phoneNo || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Address:
                </Label>
                <Input
                  type="text"
                  name="address"
                  value={updateUser?.address || ""}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-fulll border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  City:
                </Label>
                <Input
                  type="text"
                  name="city"
                  value={updateUser?.city || ""}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="w-fulll border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Zip Code:
                </Label>
                <Input
                  type="text"
                  name="zipCode"
                  value={updateUser?.zipCode || ""}
                  onChange={handleChange}
                  placeholder="Enter your zip code"
                  className="w-fulll border rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div className="flex gap-3 items-center">
                <Label className="block text-sm font-medium">Role :</Label>

                <RadioGroup value={updateUser?.role}
                onValueChange={(value)=>setUpdateUser({...updateUser, role:value})}
                className="flex flex-row gap-6 items-center">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
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
    </div>
  );
};

export default UserInfo;
