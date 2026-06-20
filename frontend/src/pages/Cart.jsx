import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setCart } from "@/redux/productSlice";
import axios from "axios";
import { ShoppingCart, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  const navigate = useNavigate();

  const API = "http://localhost:5000/api/v1/cart";
  const accessToken = localStorage.getItem("accessToken");


const loadCart = async() =>{
  try {
      const res = await axios.get(API, {
        headers:{
          Authorization: 'Bearer ${accessToken}'
        }
      })
      if(res.data.success){
        dispatch(setCart(res.data.cart));
      }
  } catch (error) {
    console.log(error);
    
  }
}

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };


const handleRemove  = async(productId) =>{
try {
  const res = await axios.delete(`${API}/remove`,{
     headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
           data:{productId}
  })
  if(res.data.success){
    dispatch(setCart(res.data.cart));
    toast.success("Product removed from cart")
  }
} catch (error) {
  console.log(error);
  
}
}

useEffect(()=>{
  loadCart()
},[dispatch])

  return (
    <div className="pt-25 bg-gray-50 min-h-screen py-6">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>

          <div className="flex gap-6 items-start">
            {/* Products Section */}
            <div className="w-[65%] flex flex-col gap-5">
              {cart.items.map((product, index) => (
                <Card key={index} className="p-5">
                  <div className="flex items-center justify-between">
                    {/* Product Info */}
                    <div className="flex items-center gap-5 w-[380px]">
                      <img
                        src={product?.productId?.productImg?.[0]?.url}
                        alt=""
                        className="w-24 h-24 object-cover"
                      />

                      <div>
                        <h1 className="font-semibold text-lg line-clamp-2">
                          {product?.productId?.productName}
                        </h1>

                        <p className="text-gray-600 mt-1">
                          ₹
                          {product?.productId?.productPrice?.toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId._id,
                            "decrease",
                          )
                        }
                        variant="outline"
                      >
                        -
                      </Button>

                      <span className="font-semibold">{product?.quantity}</span>

                      <Button
                        onClick={() =>
                          handleUpdateQuantity(
                            product.productId._id,
                            "increase",
                          )
                        }
                        variant="outline"
                      >
                        +
                      </Button>
                    </div>

                    {/* Total Price */}
                    <div className="font-semibold text-lg min-w-[120px] text-center">
                      ₹
                      {(
                        product?.productId?.productPrice * product?.quantity
                      ).toLocaleString("en-IN")}
                    </div>

                    {/* Remove */}
                    <button onClick={()=>handleRemove(product?.productId?._id)} className="flex items-center gap-2 text-red-500 hover:text-red-600 min-w-[100px]">
                      <Trash2 size={18} />
                      Remove
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-[35%] sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart?.items?.length} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="Promo Code" />
                      <Button variant="outline">Apply</Button>
                    </div>

                    <Button className="w-full bg-pink-600">Place Order</Button>

                    <Button variant="outline" className="w-full bg-transparent">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground pt-4">
                    <p>* Free Shipping on Order over 299</p>
                    <p>* 30 Days Return Policy</p>
                    <p>* Secure Checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center flex-col p-6 text-center items-center h-[60vh]">
          <div>
            <ShoppingCart className="w-16 h-16 text-pink-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-gray-600">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="cursor-pointer mt-6 bg-pink-600 text-white py-3 px-6 hover:bg-pink-700"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
