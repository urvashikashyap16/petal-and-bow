const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String },
  price:       { type: Number },
  qty:         { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    orderId:  { type: String },          // generated in seed.js or pre-save
    customer: { type: String, required: true },
    email:    { type: String, required: true },
    phone:    { type: String, default: "" },
    address:  { type: String, default: "" },
    city:     { type: String, default: "" },
    pin:      { type: String, default: "" },
    items:    [orderItemSchema],
    total:    { type: Number, required: true },
    status:   { type: String, default: "Pending", enum: ["Pending","Processing","Shipped","Delivered","Cancelled"] },
  },
  { timestamps: true }
);

// Auto-generate a friendly order ID before saving (single save calls)
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const num = Math.floor(1000 + Math.random() * 9000);
    this.orderId = `PB-${num}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);