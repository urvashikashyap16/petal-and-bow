const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:        { type: String, default: "" },
    city:         { type: String, default: "" },
    totalOrders:  { type: Number, default: 0 },
    totalSpent:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Expose `joined` as the createdAt date string for the frontend
customerSchema.virtual("joined").get(function () {
  return this.createdAt ? this.createdAt.toISOString().split("T")[0] : "";
});

customerSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Customer", customerSchema);