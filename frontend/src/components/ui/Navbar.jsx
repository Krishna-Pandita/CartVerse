import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import cartverse_bag_star_icon from "../../assets/cartverse_bag_star_icon.png";

function Navbar() {
  const {user} = useSelector((store) => store.user);
  const {cart} = useSelector((store)=> store.product)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = user?.role === "admin" ? true: false

const handleLogout = async () => {
  try {
const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      await fetch("http://localhost:5000/api/v1/user/logout", {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }

    dispatch(setUser(null));
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  } catch (error) {
    console.log(error);
    dispatch(setUser(null));
    localStorage.removeItem("accessToken");
    toast.error("Logout failed");
  }
};

  return (
    <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto h-[77px] flex justify-between items-center py-3">
        {/* Logo Section */}
        <div className="flex justify-center items-center">
          <img onClick={() => navigate("/")} src={cartverse_bag_star_icon} alt="Logo" className=" cursor-pointer h-12 w-auto" />
          <h1 className="font-semibold text-[22px] text-gray-600">CartVerse</h1>
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
             
                <Link to={`/profile/${user._id}`}>Hello, {user.firstName}</Link>
           
            )}

           {admin && (
             
                <Link to={`/dashboard/sales`}>Dashboard</Link>
           
            )}


          </ul>
          <Link to="/cart" className="relative">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute  px-2 -right-5 -top-3 text-white">
             {
  cart?.items?.reduce(
    (total, item) => total + item.quantity,
    0
  ) || 0
}
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
