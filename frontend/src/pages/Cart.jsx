import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { setCart } from "@/redux/productSlice";
import axios from "axios";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 40;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  const navigate = useNavigate();

  const API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/cart`;
  const accessToken = localStorage.getItem("accessToken");

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  const itemsCount =
    cart?.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 bg-gray-50/70 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {cart?.items?.length > 0 ? (
          <div>
            <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-6">
              Shopping Cart ({itemsCount})
            </h1>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
              {/* Products Section */}
              <div className="w-full lg:w-[65%] flex flex-col gap-4">
                {cart.items.map((item, index) => {
                  const product = item?.productId;
                  if (!product) return null;
                  const itemTotal = (product.productPrice || 0) * item.quantity;

                  return (
                    <Card
                      key={product._id || index}
                      className="p-3.5 sm:p-5 border-gray-200 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Product Info: Image + Name + Price */}
                        <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                          <img
                            onClick={() => navigate(`/products/${product._id}`)}
                            src={
                              product.productImg?.[0]?.url || "/placeholder.png"
                            }
                            alt={product.productName}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0 cursor-pointer border border-gray-100 bg-gray-50"
                          />

                          <div className="min-w-0 flex-1">
                            <h2
                              onClick={() =>
                                navigate(`/products/${product._id}`)
                              }
                              className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 hover:text-pink-600 transition-colors cursor-pointer"
                            >
                              {product.productName}
                            </h2>

                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                              Unit Price:{" "}
                              <span className="font-medium text-gray-800">
                                ₹
                                {Number(product.productPrice || 0).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </p>

                            <p className="sm:hidden font-bold text-sm text-pink-600 mt-1">
                              Total: ₹{itemTotal.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        {/* Controls Row on Mobile / Columns on Tablet & Desktop */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                            <Button
                              onClick={() =>
                                handleUpdateQuantity(product._id, "decrease")
                              }
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-600 hover:text-black cursor-pointer font-bold"
                            >
                              -
                            </Button>

                            <span className="font-semibold text-sm w-7 text-center">
                              {item.quantity}
                            </span>

                            <Button
                              onClick={() =>
                                handleUpdateQuantity(product._id, "increase")
                              }
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-600 hover:text-black cursor-pointer font-bold"
                            >
                              +
                            </Button>
                          </div>

                          {/* Desktop Total Price */}
                          <div className="hidden sm:block font-bold text-base text-gray-900 min-w-[90px] text-right">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(product._id)}
                            className="flex items-center gap-1.5 text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer p-1 rounded transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-[35%] lg:sticky lg:top-28">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Order Summary
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-4 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({itemsCount} items)</span>
                      <span className="font-medium text-gray-900">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-900">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-semibold">
                            FREE
                          </span>
                        ) : (
                          `₹${shipping.toLocaleString("en-IN")}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Estimated Tax (5%)</span>
                      <span className="font-medium text-gray-900">
                        ₹{tax.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 my-2 pt-3 flex justify-between font-bold text-lg text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-pink-600">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-3">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Promo code"
                          className="text-xs sm:text-sm bg-gray-50 h-9"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 text-xs"
                        >
                          Apply
                        </Button>
                      </div>

                      <Button
                        onClick={() => navigate("/address")}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        <span>Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => navigate("/products")}
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm cursor-pointer"
                      >
                        Continue Shopping
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 pt-3 border-t border-gray-100 space-y-1">
                      <p>✓ Free shipping on orders over ₹299</p>
                      <p>✓ 30 Days easy return & replacement</p>
                      <p>✓ 100% Secure Checkout with SSL encryption</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center flex-col p-6 text-center items-center py-20 bg-white rounded-2xl border border-gray-100 my-8 shadow-xs">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Your Cart is Empty
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              Looks like you haven't added anything to your cart yet. Explore our
              products and discover amazing deals!
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="cursor-pointer mt-6 bg-pink-600 hover:bg-pink-700 text-white py-2.5 px-6 font-semibold rounded-lg shadow-md transition-all"
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
