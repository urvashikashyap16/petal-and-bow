const router   = require("express").Router();
const Order    = require("../models/Order");
const Product  = require("../models/Product");
const Customer = require("../models/Customer");

// ── GET all  (?status=Shipped&search=priya) ───────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (search) filter.$or = [
      { customer: { $regex: search, $options: "i" } },
      { orderId:  { $regex: search, $options: "i" } },
    ];
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET one ───────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST create (checkout) ────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { customer, email, phone, address, city, pin, items, total } = req.body;

    // Validate stock and enrich items with product info
    const enrichedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      // Decrement stock + increment sales
      product.stock -= item.qty;
      product.sales += item.qty;
      await product.save();

      enrichedItems.push({ productId: product._id, productName: product.name, price: product.price, qty: item.qty });
    }

    const order = await Order.create({ customer, email, phone, address, city, pin, items: enrichedItems, total });

    // Upsert customer record
    const existing = await Customer.findOne({ email });
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent  += total;
      await existing.save();
    } else {
      await Customer.create({ name: customer, email, phone, city, totalOrders: 1, totalSpent: total });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT update status ─────────────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE ────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;