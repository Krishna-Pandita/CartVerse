import razorpayInstance from "../config/razorpay";
import { Order } from "../models/orderModel.js";
import crypto from "crypto"
import { Cart } from "../models/cartModel.js"

export const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.log("Error in create order", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
      const {razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed} = req.body;
      const userId = req.user._id;
      if(paymentFailed){
        const order = await Order.findOneAndUpdate(
          {razorpayOrderId: razorpay_order_id},
          {status:"Failed"},
          {new:true}
        );
        return res.status(400).json({
          success:false,
          message:"Payment Failed",
          order
        })
      }

     const sign = razorpay_order_id + "|" + razorpay_payment_id;
     const expectedSignature = crypto
     .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

      if(expectedSignature === razorpay_signature){
        const order = await Order.findOneAndUpdate(
          {razorpayOrderId: razorpay_order_id},
          {
            status:"Paid",
            razorpayPayementId:razorpay_payment_id,
            razorpaySignature: razorpay_signature
          },
          {new:true}
        );

        await Cart.findOneAndUpdate({userId})
      }
  } catch (error) {

  }
};
