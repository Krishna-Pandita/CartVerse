import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/signup.jsx";
import Navbar from "./components/ui/Navbar.jsx";
import Verify from "./pages/Verify.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminSales from "./pages/admin/AdminSales.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import AdminProduct from "./pages/admin/AdminProduct.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import ShowUserOrders from "./pages/admin/ShowUserOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import UserInfo from "./pages/admin/UserInfo.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "/verify",
    element: (
      <>
        <Verify />
      </>
    ),
  },
   {
    path: "/verify/:token",
    element: (
      <>
        <VerifyEmail />
      </>
    ),
  },
   {
    path: "/profile/:userId",
    element: (
      <>
      <ProtectedRoute>
        <Navbar />
        <Profile />
        </ProtectedRoute>
      
      </>
    ),
  },

  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Products />
      
      </>
    ),
  },


    {
    path: "/products/:id",
    element: (
      <>
        <Navbar />
        <SingleProduct />
      
      </>
    ),
  },


   {
    path: "/cart",
    element: (
      <>
       <ProtectedRoute>
        <Navbar />
        <Cart />
       </ProtectedRoute>
        
      
      </>
    ),
  },

 {
  path: "/dashboard",
  element: <ProtectedRoute adminOnly={true}> <Navbar/> <Dashboard /> </ProtectedRoute>,
  children: [
    {
      path: "sales",
      element: <AdminSales />
    },

     {
      path: "add-product",
      element: <AddProduct />
    },

     {
      path: "products",
      element: <AdminProduct />
    },

     {
      path: "orders",
      element: <AdminOrders />
    },

     {
      path: "users/orders/:userId",
      element: <ShowUserOrders />
    },

     {
      path: "users",
      element: <AdminUsers />
    },

     {
      path: "users/:id",
      element: <UserInfo />
    },

  ],
},
  
]);


const App = () => {
  return <RouterProvider router={router} />;
}

export default App;