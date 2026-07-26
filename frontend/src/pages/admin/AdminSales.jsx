import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react';
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
    totalOrders:0,
    totalSales: 0,
    sales:[]
  });
  const [loading, setLoading] = useState(false);

const fetchstats = async()=>{
  setLoading(true);
  try {
    const accessToken = localStorage.getItem("accessToken");
    const res = await axios.get(
      `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if(res.data.success){
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
    <div className='pl-[350px] bg-gray-100 py-20 pr-20 mx-auto px-4'>
      <div className='flex justify-between items-center mb-6 pt-4'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <button 
          onClick={fetchstats} 
          disabled={loading}
          className='flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 disabled:opacity-50'
        >
          <RefreshCw className={` h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      <div className='grid lg:grid-cols-4 gap-6 p-6' >

         <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{stats.totalUsers}</p>
          </CardContent>
         </Card>

          <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{stats.totalProducts}</p>
          </CardContent>
         </Card>


          <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{stats.totalOrders}</p>
          </CardContent>
         </Card>



          <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{stats.totalSales}</p>
          </CardContent>
         </Card>



         <Card className="lg:col-span-4">
  <CardHeader>
    <CardTitle>Sales (Last 30 Days)</CardTitle>
  </CardHeader>

  <CardContent style={{ height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={stats.sales}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        <Area
          type="monotone"
          dataKey="amount"
          stroke="#ec4899"
          fill="#f9a8d4"
        />
      </AreaChart>
    </ResponsiveContainer>
  </CardContent>
</Card>




      </div>
    </div>
  )
}

export default AdminSales