import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RefreshCw, Users, Package, ShoppingCart, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchstats = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_URL ||
        "http://localhost:5000";

      const res = await axios.get(`${backendUrl}/api/v1/orders/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchstats();
  }, []);

  return (
    <div className="md:pl-72 lg:pl-80 px-4 sm:px-6 md:pr-8 pt-32 sm:pt-36 md:pt-28 pb-16 min-h-screen bg-gray-50/70 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Sales Analytics
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Overview of store performance, orders, and revenue
            </p>
          </div>

          <button
            onClick={fetchstats}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700 disabled:opacity-50 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-xs border-0 rounded-2xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-pink-100">
                Total Users
              </CardTitle>
              <Users className="w-4 h-4 text-pink-200" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-extrabold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xs border-0 rounded-2xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-purple-100">
                Total Products
              </CardTitle>
              <Package className="w-4 h-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-extrabold">{stats.totalProducts}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xs border-0 rounded-2xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Total Orders
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-extrabold">{stats.totalOrders}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xs border-0 rounded-2xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-emerald-200" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl sm:text-3xl font-extrabold">
                ₹{Number(stats.totalSales || 0).toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart Card */}
        <Card className="rounded-2xl border-gray-200 shadow-2xs overflow-hidden">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
              Sales Trend (Recent Activity)
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="w-full h-[260px] sm:h-[320px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.sales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Sales"]}
                    contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e5e7eb" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#db2777"
                    fill="#fbcfe8"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSales;