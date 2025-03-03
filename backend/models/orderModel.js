import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true }, 
        price: { type: Number, required: true }, 
        licenseType: { type: String, required: true }, 
        application: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Application", 
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String }, 
      status: { type: String }, 
      update_time: { type: String }, 
      email_address: { type: String }, 
    },
    itemsPrice: {
      type: Number,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    transactionId: { type: String }, 
    orderStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveryMethod: {
      type: String,
      enum: ["Download", "Email"], 
      default: "Download",
    },
    isPaid: { type: Boolean, default: false }, 
    paidAt: { type: Date }, 
    isDelivered: { type: Boolean, default: false }, 
    deliveredAt: { type: Date }, 
  },
  { timestamps: true } 
);

const Order = mongoose.model("Order", orderSchema);

export default Order;