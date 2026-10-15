const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    category:    { type: String, required: true, enum: ["Hair","Bags","Rings","Necklaces","Earrings","Sunglasses","Bracelets"] },
    price:       { type: Number, required: true, min: 0 },
    stock:       { type: Number, required: true, min: 0, default: 0 },
    description: { type: String, default: "" },
    sku:         { type: String, required: true, unique: true, trim: true },
    imageKey:    { type: String, default: "" },   // e.g. "hair1"  → /images/hair1.jpg
    sales:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual: full image path for the client
productSchema.virtual("image").get(function () {
  return this.imageKey ? `/images/${this.imageKey}.jpg` : "";
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);