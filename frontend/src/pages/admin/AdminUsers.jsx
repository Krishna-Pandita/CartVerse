import { Input } from '@/components/ui/input';
import { Edit2, Eye, Search, Users as UsersIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Profile from '../../assets/profile.png';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/user/all-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="md:pl-72 lg:pl-80 px-4 sm:px-6 md:pr-8 pt-32 sm:pt-36 md:pt-28 pb-16 min-h-screen bg-gray-50/70 w-full">
      <div className="max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            View, search, edit, and inspect order histories for registered users ({users.length} total)
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm mt-5">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 h-10 text-xs sm:text-sm shadow-2xs rounded-xl"
            placeholder="Search users by name or email..."
          />
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Users Responsive Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center my-6 shadow-2xs">
            <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-800">No users found</h3>
            <p className="text-gray-500 text-xs mt-1">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {filteredUsers.map((user, index) => {
              return (
                <div
                  key={user._id || index}
                  className="bg-white border border-pink-100 p-5 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={user?.profilePic || Profile}
                      alt=""
                      className="rounded-full w-14 h-14 sm:w-16 sm:h-16 aspect-square object-cover border-2 border-pink-500 shrink-0 bg-pink-50"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email}
                      </p>
                      <span className="inline-block bg-pink-50 text-pink-700 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wide">
                        {user?.role || "user"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 mt-5 pt-3 border-t border-gray-100">
                    <Button
                      onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-gray-200 text-gray-700 hover:bg-pink-50 hover:text-pink-600 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-gray-200 text-gray-700 hover:bg-pink-50 hover:text-pink-600 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Orders
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
