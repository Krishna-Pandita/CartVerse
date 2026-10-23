import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const navItems = [
    { to: "/dashboard/sales", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/add-product", label: "Add Product", icon: PackagePlus },
    { to: "/dashboard/products", label: "Products", icon: PackageSearch },
    { to: "/dashboard/users", label: "Users", icon: Users },
    { to: "/dashboard/orders", label: "Orders", icon: FaRegEdit },
  ];

  return (
    <>
      {/* Mobile & Tablet Admin Sub-Nav Header (visible below md) */}
      <div className="md:hidden fixed top-[68px] sm:top-[77px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-pink-200 px-3 py-2 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? "bg-pink-600 text-white shadow-2xs"
                      : "bg-pink-50 text-gray-700 hover:bg-pink-100"
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Desktop Fixed Sidebar (visible md and up) */}
      <aside className="hidden md:block fixed top-[77px] left-0 bottom-0 w-64 lg:w-72 bg-pink-50/70 border-r border-pink-200 p-5 z-20 overflow-y-auto">
        <div className="mb-4 px-3 py-1">
          <p className="text-xs uppercase tracking-wider font-bold text-gray-400">
            Admin Management
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-pink-600 text-white shadow-xs"
                      : "text-gray-700 hover:bg-pink-100/70 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;