const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
require("dotenv").config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173" }));   // Vite dev server
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────
app.use("/api/products",  require("./routes/products"));
app.use("/api/orders",    require("./routes/orders"));
app.use("/api/customers", require("./routes/customers"));

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

// ── Error handler ─────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal server error" });
});

// ── Connect DB then start ─────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB connected →", process.env.MONGO_URI);
    app.listen(process.env.PORT, () =>
      console.log(`🚀  Server running  →  http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });