import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User as UserIcon, LayoutDashboard, Home, ShoppingBag, LogOut, LogIn, Phone, Info } from "lucide-react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import cartverse_bag_star_icon from "../../assets/cartverse_bag_star_icon.png";

function Navbar() {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const admin = user?.role === "admin";

  const totalCartCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await fetch(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/user/logout`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      dispatch(setUser(null));
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      toast.success("Logged out successfully");
      setMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      dispatch(setUser(null));
      localStorage.removeItem("accessToken");
      toast.error("Logout failed");
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-pink-50 fixed top-0 left-0 w-full z-40 border-b border-pink-200 shadow-xs">
      <div className="max-w-7xl mx-auto h-[68px] sm:h-[77px] flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div
          onClick={() => {
            navigate("/");
            closeMenu();
          }}
          className="flex justify-center items-center gap-1.5 cursor-pointer select-none"
        >
          <img
            src={cartverse_bag_star_icon}
            alt="CartVerse Logo"
            className="h-8 w-10 sm:h-10 sm:w-12 object-contain"
          />
          <span className="font-semibold text-lg sm:text-[22px] text-gray-800 tracking-tight">
            CartVerse
          </span>
        </div>

        {/* Desktop Nav Section */}
        <nav className="hidden md:flex justify-between items-center gap-6 lg:gap-9">
          <ul className="flex gap-5 lg:gap-7 text-base lg:text-lg items-center font-semibold text-gray-700">
            <li>
              <Link
                to="/"
                className={`transition-colors hover:text-pink-600 ${
                  location.pathname === "/" ? "text-pink-600 font-bold" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`transition-colors hover:text-pink-600 ${
                  location.pathname.startsWith("/products")
                    ? "text-pink-600 font-bold"
                    : ""
                }`}
              >
                Products
              </Link>
            </li>

            {user && (
              <li>
                <Link
                  to={`/profile/${user._id}`}
                  className="transition-colors hover:text-pink-600 truncate max-w-[150px] inline-block"
                >
                  Hello, {user.firstName}
                </Link>
              </li>
            )}

            {admin && (
              <li>
                <Link
                  to="/dashboard/sales"
                  className={`transition-colors hover:text-pink-600 ${
                    location.pathname.startsWith("/dashboard")
                      ? "text-pink-600 font-bold"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalCartCount > 0 && (
              <span className="bg-pink-600 rounded-full absolute text-xs px-1.5 py-0.2 -right-1.5 -top-1 text-white font-semibold min-w-5 text-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </Link>

          {user ? (
            <Button
              onClick={handleLogout}
              className="bg-pink-600 text-white hover:bg-pink-700 cursor-pointer text-sm font-medium px-4 py-2"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 cursor-pointer text-sm font-medium px-5 py-2 shadow-sm"
            >
              Login
            </Button>
          )}
        </nav>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            onClick={closeMenu}
            className="relative p-2 text-gray-700 hover:text-pink-600"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalCartCount > 0 && (
              <span className="bg-pink-600 rounded-full absolute text-xs px-1.5 py-0.2 -right-1 -top-1 text-white font-bold min-w-5 text-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-gray-700 hover:text-pink-600 hover:bg-pink-100/70 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div
            onClick={closeMenu}
            className="fixed inset-0 top-[68px] sm:top-[77px] bg-black/40 z-30 transition-opacity"
          />

          {/* Menu Container */}
          <div className="fixed top-[68px] sm:top-[77px] left-0 right-0 bg-white border-b border-pink-200 z-40 max-h-[calc(100vh-77px)] overflow-y-auto shadow-xl px-5 py-6">
            {user && (
              <div className="pb-4 mb-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Signed in as
                  </p>
                  <p className="font-bold text-gray-800 text-base">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[240px]">
                    {user.email}
                  </p>
                </div>
                {user.role === "admin" && (
                  <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            )}

            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold transition-colors ${
                  location.pathname === "/"
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Home className="w-5 h-5 text-pink-500" />
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold transition-colors ${
                  location.pathname.startsWith("/products")
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-pink-500" />
                Products
              </Link>

              {user && (
                <Link
                  to={`/profile/${user._id}`}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold transition-colors ${
                    location.pathname.startsWith("/profile")
                      ? "bg-pink-50 text-pink-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <UserIcon className="w-5 h-5 text-pink-500" />
                  My Profile
                </Link>
              )}

              {admin && (
                <Link
                  to="/dashboard/sales"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold transition-colors ${
                    location.pathname.startsWith("/dashboard")
                      ? "bg-pink-50 text-pink-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 text-pink-500" />
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-pink-500" />
                  Cart
                </div>
                {totalCartCount > 0 && (
                  <span className="bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalCartCount} items
                  </span>
                )}
              </Link>

              <div className="border-t border-gray-100 my-2 pt-2">
                <Link
                  to="/about"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Info className="w-4 h-4 text-gray-400" />
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Phone className="w-4 h-4 text-gray-400" />
                  Contact Support
                </Link>
              </div>
            </nav>

            <div className="pt-4 mt-2 border-t border-gray-100">
              {user ? (
                <Button
                  onClick={handleLogout}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    closeMenu();
                    navigate("/login");
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  Login to Account
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
