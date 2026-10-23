import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MapPin, ShieldCheck, ArrowLeft, Trash2, Plus } from "lucide-react";

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product
  );
  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      return toast.error("Please fill in required address fields");
    }
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 40;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_URL ||
    "http://localhost:5000";

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!data.success) {
        return toast.error("Something went wrong");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "CartVerse",
        description: "Order Payment",

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/v1/orders/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            if (verifyRes.data.success) {
              toast.success("Payment Successful");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("Payment Verification Failed");
            }
          } catch (error) {
            toast.error("Error Verifying Payment");
          }
        },

        modal: {
          ondismiss: async function () {
            await axios.post(
              `${backendUrl}/api/v1/orders/verify-payment`,
              {
                razorpay_order_id: data.order.id,
                paymentFailed: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            toast.error("Payment cancelled or failed");
          },
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#f472b6",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function (response) {
        await axios.post(
          `${backendUrl}/api/v1/orders/verify-payment`,
          {
            razorpay_order_id: data.order.id,
            paymentFailed: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.error("Payment failed. Please try again");
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while processing payment");
    }
  };

  return (
    <div className="pt-20 sm:pt-24 md:pt-28 min-h-screen bg-gray-50/70 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cart")}
            className="p-1.5 rounded-lg text-gray-600 hover:text-black cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Delivery & Payment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Address Information (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-2xs">
            {showForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h2 className="font-bold text-lg text-gray-900">
                    Add Delivery Address
                  </h2>
                  {addresses?.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(false)}
                      className="text-xs text-pink-600"
                    >
                      Cancel
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-xs font-semibold text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      required
                      placeholder="+91 9419123789"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    placeholder="House / Flat no, Street, Landmark"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-xs font-semibold text-gray-700">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-xs font-semibold text-gray-700">
                      State *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      required
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip" className="text-xs font-semibold text-gray-700">
                      PIN / Zip Code *
                    </Label>
                    <Input
                      id="zip"
                      name="zip"
                      required
                      placeholder="e.g. 400001"
                      value={formData.zip}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-xs font-semibold text-gray-700">
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="India"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 mt-2 cursor-pointer rounded-lg"
                >
                  Save Address & Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">
                    Select Delivery Address
                  </h2>
                  <Button
                    onClick={() => setShowForm(true)}
                    variant="outline"
                    size="sm"
                    className="text-xs flex items-center gap-1 border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New
                  </Button>
                </div>

                <div className="space-y-3">
                  {addresses.map((addr, idx) => (
                    <div
                      onClick={() => dispatch(setSelectedAddress(idx))}
                      key={idx}
                      className={`border-2 p-4 rounded-xl cursor-pointer relative transition-all ${
                        selectedAddress === idx
                          ? "border-pink-600 bg-pink-50/50 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            checked={selectedAddress === idx}
                            onChange={() => dispatch(setSelectedAddress(idx))}
                            className="mt-1 accent-pink-600 w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {addr.fullName}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {addr.phone} {addr.email && `• ${addr.email}`}
                            </p>
                            <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                              {addr.address}, {addr.city}, {addr.state} - {addr.zip},{" "}
                              {addr.country || "India"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteAddress(idx));
                          }}
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Delete address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  disabled={selectedAddress === null}
                  onClick={handlePayment}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer mt-4"
                >
                  Proceed to Payment (₹{total.toLocaleString("en-IN")})
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary (5 cols on lg) */}
          <div className="lg:col-span-5 w-full">
            <Card className="border-gray-200 shadow-sm w-full">
              <CardHeader className="pb-3 border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items?.length || 0} items)</span>
                  <span className="font-medium text-gray-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-medium text-gray-900">₹{tax}</span>
                </div>

                <div className="border-t border-gray-200 my-2 pt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-pink-600">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="text-xs text-gray-500 pt-3 border-t border-gray-100 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                    <span>Razorpay Secure 256-bit encrypted checkout</span>
                  </div>
                  <p>✓ All cards, UPI, and Netbanking accepted</p>
                  <p>✓ 100% Buyer protection guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
