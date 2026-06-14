import React from "react";
import icon1 from "../../assets/icon1.png";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";

function Navbar() {
  const {user} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogout = async () => {
  try {
    const res = await fetch(
      
      "http://localhost:5000/api/v1/user/logout",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    console.log("logout response:", data);

    if (data?.success) {
      dispatch(setUser(null));
      localStorage.removeItem("token");
      toast.success(data.message || "Logged out successfully");
    } else {
      toast.error(data?.message || "Logout failed");
    }
  } catch (error) {
    console.log(error);
    toast.error("Server error during logout");
  }
};

  return (
    <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        {/* Logo Section */}
        <div>
          <img src={icon1} alt="Logo" className="h-10 w-auto" />
        </div>
        {/* nav section */}
        <nav className="flex justify-between items-center gap-9">
          <ul className="flex gap-7 text-xl items-center font-semibold">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            {user && (
              <li>
                <Link to={`/profile/${user._id}`}>Hello, {user.firstName}</Link>
              </li>
            )}
          </ul>
          <Link to="/cart" className="relative">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute  px-2 -right-5 -top-3 text-white">
              0
            </span>
          </Link>
          {user ? (
            <Button onClick={handleLogout} className="bg-pink-500 text-white hover:bg-pink-600 cursor-pointer">
              Logout
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")} className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white hover:bg-pink-600 cursor-pointer">
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
