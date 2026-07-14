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
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    (store) => store.product,
  );
  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
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
        },
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
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
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
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              {
                razorpay_order_id: data.order.id,
                paymentFailed: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
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
          `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
          {
            razorpay_order_id: data.order.id,
            paymentFailed: true,
          },
          {
          headers:{
            Authorization: `Bearer ${accessToken}`
          }
        }
        );
        toast.error("Payment failed. Please try again")
      });


      rzp.open()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong while processing payment")
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid place-items-center p-10">
      <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto ">
        <div className="space-y-4 p-6 bg-white">
          {showForm ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  placeholder="+91 9419123789"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  required
                  placeholder="abc@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="Enter Your Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Enter Your City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="Enter Your State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Zip</Label>
                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="Enter Your Zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="Enter Your Country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save & Continue
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              {addresses.map((addr, idx) => {
                return (
                  <div
                    onClick={() => dispatch(setSelectedAddress(idx))}
                    key={idx}
                    className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === idx ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}
                  >
                    <p className="font-medium">{addr.fullName}</p>
                    <p className="font-medium">{addr.phone}</p>
                    <p className="font-medium">{addr.email}</p>
                    <p className="font-medium">
                      {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                      {addr.country}
                    </p>
                    <button
                      onClick={(e) => dispatch(deleteAddress(idx))}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="w-full"
              >
                + Add New Address
              </Button>

              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full bg-pink-600"
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE ORDER SUMMARY */}

        <div>
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div className="text-sm text-muted-foreground pt-4 ">
                <p>* Free Shipping on Order over 299</p>
                <p>* 30 Days Return Policy</p>
                <p>* Secure Checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
