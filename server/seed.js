/**
 * seed.js — run once to populate MongoDB with all Petal & Bow data
 * Usage:  cd server && npm run seed
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Product  = require("./models/Product");
const Order    = require("./models/Order");
const Customer = require("./models/Customer");

const PRODUCTS = [
  // ── HAIR ──
  { name:"Velvet Pearl Scrunchie",    category:"Hair",       price:299,  stock:42, imageKey:"hair1",     description:"Luxurious velvet with pearl charms, gentle on fine hair.",           sku:"HA-001", sales:87  },
  { name:"Gold Claw Clip Set",        category:"Hair",       price:449,  stock:28, imageKey:"hair2",     description:"Set of 3 gold-plated claw clips in graduating sizes.",               sku:"HA-002", sales:63  },
  { name:"Satin Ribbon Headband",     category:"Hair",       price:349,  stock:55, imageKey:"hair3",     description:"Wide satin headband with adjustable bow — one size fits all.",        sku:"HA-003", sales:114 },
  { name:"Silk Scrunchie Trio",       category:"Hair",       price:399,  stock:60, imageKey:"hair4",     description:"Three pure silk scrunchies in blush, ivory, and mocha.",             sku:"HA-004", sales:95  },
  { name:"Pressed Flower Hair Fork",  category:"Hair",       price:549,  stock:16, imageKey:"hair5",     description:"Resin hair fork with real pressed dried flowers — wearable art.",    sku:"HA-005", sales:27  },
  { name:"Butterfly Bobby Pin Pack",  category:"Hair",       price:249,  stock:70, imageKey:"hair6",     description:"Pack of 6 enamel butterfly pins in pastel tones.",                   sku:"HA-006", sales:138 },
  { name:"Crystal Crown Tiara",       category:"Hair",       price:699,  stock:12, imageKey:"hair7",     description:"Delicate rhinestone tiara for special occasions — adjustable band.", sku:"HA-007", sales:34  },
  // ── BAGS ──
  { name:"Monogram Canvas Tote",      category:"Bags",       price:1299, stock:14, imageKey:"bag1",      description:"Canvas tote with embossed monogram in dusty rose.",                  sku:"BG-001", sales:29  },
  { name:"Mini Crossbody Pouch",      category:"Bags",       price:899,  stock:21, imageKey:"bag2",      description:"Vegan leather pouch with gold chain strap.",                         sku:"BG-002", sales:47  },
  { name:"Floral Embroidered Wallet", category:"Bags",       price:749,  stock:30, imageKey:"bag3",      description:"Slim bifold wallet with hand-stitched floral detail.",               sku:"BG-003", sales:33  },
  { name:"Pearl Handle Clutch",       category:"Bags",       price:1499, stock:9,  imageKey:"bag4",      description:"Satin evening clutch with detachable pearl-bead handle.",            sku:"BG-004", sales:18  },
  { name:"Bow Backpack Mini",         category:"Bags",       price:1199, stock:17, imageKey:"bag5",      description:"Faux-leather mini backpack with oversized bow zipper pull.",         sku:"BG-005", sales:41  },
  { name:"Pastel Bucket Bag",         category:"Bags",       price:999,  stock:23, imageKey:"bag6",      description:"Slouchy bucket silhouette in cotton-candy pastel with drawstring.", sku:"BG-006", sales:55  },
  { name:"Wristlet Phone Pouch",      category:"Bags",       price:599,  stock:38, imageKey:"bag7",      description:"Fits most phones; card slots, wrist strap, rose gold zip.",          sku:"BG-007", sales:72  },
  // ── RINGS ──
  { name:"Floral Midi Ring Set",      category:"Rings",      price:499,  stock:44, imageKey:"ring1",     description:"Set of 5 stackable floral midi rings in 18k gold plate.",           sku:"RG-001", sales:108 },
  { name:"Rose Quartz Statement",     category:"Rings",      price:799,  stock:19, imageKey:"ring2",     description:"Genuine rose quartz oval cabochon in sterling silver band.",         sku:"RG-002", sales:56  },
  { name:"Butterfly Signet Ring",     category:"Rings",      price:549,  stock:31, imageKey:"ring3",     description:"Engraved butterfly motif signet in gold-fill, adjustable.",         sku:"RG-003", sales:79  },
  { name:"Daisy Enamel Ring",         category:"Rings",      price:349,  stock:58, imageKey:"ring4",     description:"White enamel daisy with yellow centre on dainty gold band.",        sku:"RG-004", sales:124 },
  { name:"Twisted Infinity Band",     category:"Rings",      price:449,  stock:40, imageKey:"ring5",     description:"Twisted double-band design in rose-gold plated 925 silver.",        sku:"RG-005", sales:88  },
  { name:"Pearl Cluster Ring",        category:"Rings",      price:649,  stock:22, imageKey:"ring6",     description:"Freshwater pearl cluster statement ring on gold band.",             sku:"RG-006", sales:47  },
  { name:"Crystal Birthstone Ring",   category:"Rings",      price:599,  stock:26, imageKey:"ring7",     description:"Swarovski crystal in your birth month — 12 colours available.",      sku:"RG-007", sales:63  },
  // ── NECKLACES ──
  { name:"Layered Gold Necklace Set", category:"Necklaces",  price:899,  stock:25, imageKey:"necklace1", description:"Triple-layer choker-to-collar set in 18k gold plate.",              sku:"NK-001", sales:66  },
  { name:"Pearl Strand Choker",       category:"Necklaces",  price:749,  stock:18, imageKey:"necklace2", description:"Single strand freshwater pearls with gold lobster clasp.",          sku:"NK-002", sales:52  },
  { name:"Initial Pendant Necklace",  category:"Necklaces",  price:549,  stock:45, imageKey:"necklace3", description:"Dainty A-Z letter pendant on 16-inch gold-fill chain.",            sku:"NK-003", sales:143 },
  { name:"Butterfly Lariat",          category:"Necklaces",  price:699,  stock:20, imageKey:"necklace4", description:"Y-lariat drop chain with pavé crystal butterfly centrepiece.",      sku:"NK-004", sales:38  },
  { name:"Floral Coin Necklace",      category:"Necklaces",  price:649,  stock:33, imageKey:"necklace5", description:"Hammered coin charm with pressed rose engraving, 18-inch chain.",  sku:"NK-005", sales:71  },
  { name:"Moonstone Drop Pendant",    category:"Necklaces",  price:849,  stock:14, imageKey:"necklace6", description:"Rainbow moonstone pear-drop set in sterling silver bezel.",         sku:"NK-006", sales:29  },
  { name:"Heart Locket Necklace",     category:"Necklaces",  price:799,  stock:27, imageKey:"necklace7", description:"Vintage-style gold locket, holds two mini photos, 20-inch chain.", sku:"NK-007", sales:84  },
  // ── EARRINGS ──
  { name:"Pearl Drop Earrings",       category:"Earrings",   price:649,  stock:35, imageKey:"earring1",  description:"Freshwater pearl drops in 925 silver, hypoallergenic.",           sku:"ER-001", sales:72  },
  { name:"Crystal Hoop Set",          category:"Earrings",   price:499,  stock:48, imageKey:"earring2",  description:"Set of 3 graduating crystal-studded hoops — mix and stack.",       sku:"ER-002", sales:116 },
  { name:"Enamel Daisy Studs",        category:"Earrings",   price:299,  stock:64, imageKey:"earring3",  description:"White enamel daisy studs with gold-tone posts, push-back.",        sku:"ER-003", sales:158 },
  { name:"Feather Tassel Drops",      category:"Earrings",   price:549,  stock:22, imageKey:"earring4",  description:"Blush micro-feather tassels with hammered gold disc top.",          sku:"ER-004", sales:44  },
  { name:"Butterfly Crawler Earring", category:"Earrings",   price:449,  stock:29, imageKey:"earring5",  description:"Ear-crawler butterfly that climbs the lobe — single or pair.",      sku:"ER-005", sales:67  },
  { name:"Vintage Chandelier Drop",   category:"Earrings",   price:749,  stock:15, imageKey:"earring6",  description:"Antique-finish gold chandelier with seed pearl accents.",           sku:"ER-006", sales:31  },
  { name:"Huggie Hoop Charm",         category:"Earrings",   price:399,  stock:52, imageKey:"earring7",  description:"Mini huggie hoops with a hanging star or moon charm, pair.",       sku:"ER-007", sales:93  },
  // ── SUNGLASSES ──
  { name:"Butterfly Frame Sunnies",    category:"Sunglasses", price:1199, stock:18, imageKey:"sunglass1", description:"Oversized butterfly silhouette with rose-tinted UV400 lenses.",    sku:"SG-001", sales:49  },
  { name:"Cat-Eye Retro Shades",       category:"Sunglasses", price:999,  stock:24, imageKey:"sunglass2", description:"Classic 60s cat-eye in tortoiseshell with gold temples.",          sku:"SG-002", sales:74  },
  { name:"Round Wire Frame Sunglasses",category:"Sunglasses", price:849,  stock:31, imageKey:"sunglass3", description:"Thin gold wire round frames with gradient brown lenses.",          sku:"SG-003", sales:61  },
  { name:"Rimless Tinted Shades",      category:"Sunglasses", price:799,  stock:27, imageKey:"sunglass4", description:"Barely-there rimless design with blush pink polarised lenses.",    sku:"SG-004", sales:38  },
  { name:"Heart Shape Sunglasses",     category:"Sunglasses", price:699,  stock:40, imageKey:"sunglass5", description:"Playful heart-shaped frames in matte black, UV400 protection.",    sku:"SG-005", sales:82  },
  { name:"Pearl Accent Square Frame",  category:"Sunglasses", price:1099, stock:14, imageKey:"sunglass6", description:"Chunky square frames with pearl-inlay corner detail.",             sku:"SG-006", sales:27  },
  { name:"Ombre Oval Shades",          category:"Sunglasses", price:899,  stock:22, imageKey:"sunglass7", description:"Oval lenses with rose-to-amber ombre gradient tint.",              sku:"SG-007", sales:55  },
  // ── BRACELETS ──
  { name:"Rose Quartz Bead Bracelet",  category:"Bracelets",  price:799,  stock:22, imageKey:"bracelet1", description:"Genuine rose quartz beads with sterling silver clasp.",           sku:"BR-001", sales:58  },
  { name:"Daisy Chain Anklet",         category:"Bracelets",  price:449,  stock:18, imageKey:"bracelet2", description:"Hand-linked daisy motifs in gold vermeil, adjustable 6–9 in.",   sku:"BR-002", sales:39  },
  { name:"Gold Bangle Stack Set",      category:"Bracelets",  price:699,  stock:35, imageKey:"bracelet3", description:"Set of 4 slim 18k gold-plated bangles — wear solo or stacked.", sku:"BR-003", sales:96  },
  { name:"Crystal Tennis Bracelet",    category:"Bracelets",  price:999,  stock:20, imageKey:"bracelet4", description:"Pavé cubic zirconia tennis bracelet, 925 silver, box clasp.",    sku:"BR-004", sales:73  },
  { name:"Pearl Charm Bracelet",       category:"Bracelets",  price:849,  stock:16, imageKey:"bracelet5", description:"Freshwater pearl and gold charm chain, lobster clasp, 7 in.",    sku:"BR-005", sales:44  },
  { name:"Enamel Flower Bangle",       category:"Bracelets",  price:549,  stock:44, imageKey:"bracelet6", description:"Rigid enamel bangle with raised floral motifs in pastel tones.", sku:"BR-006", sales:61  },
  { name:"Woven Thread Bracelet Set",  category:"Bracelets",  price:349,  stock:60, imageKey:"bracelet7", description:"Set of 5 handwoven friendship-style bracelets in blush palette.", sku:"BR-007", sales:112 },
];

const CUSTOMERS = [
  { name:"Priya Sharma",  email:"priya@email.com",  phone:"9876543210", city:"Mumbai",    totalOrders:8,  totalSpent:12450 },
  { name:"Aisha Sharma",    email:"aisha@email.com",  phone:"9812345678", city:"Delhi",     totalOrders:5,  totalSpent:8970  },
  { name:"Riya Patel",    email:"riya@email.com",   phone:"9898989898", city:"Ahmedabad", totalOrders:3,  totalSpent:4230  },
  { name:"Ananya Roy",    email:"ananya@email.com", phone:"9765432109", city:"Kolkata",   totalOrders:2,  totalSpent:2799  },
  { name:"Sneha Gupta",   email:"sneha@email.com",  phone:"9654321098", city:"Pune",      totalOrders:11, totalSpent:18670 },
  { name:"Meera Singh",    email:"meera@email.com",  phone:"9543210987", city:"Bangalore", totalOrders:4,  totalSpent:5640  },
  { name:"Diya Singh",    email:"diya@email.com",   phone:"9432109876", city:"Hyderabad", totalOrders:6,  totalSpent:9870  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB");

    // Wipe existing data
    await Promise.all([Product.deleteMany(), Order.deleteMany(), Customer.deleteMany()]);
    console.log("🗑️   Cleared existing collections");

    // Insert products
    const products = await Product.insertMany(PRODUCTS);
    console.log(`📦  Inserted ${products.length} products`);

    // Insert customers
    const customers = await Customer.insertMany(CUSTOMERS);
    console.log(`👥  Inserted ${customers.length} customers`);

    // Insert sample orders using real product IDs
    const getP = (sku) => products.find(p => p.sku === sku);
    const getC = (email) => customers.find(c => c.email === email);

    const ORDERS = [
      { customer:"Priya Sharma",  email:"priya@email.com",  phone:"9876543210", city:"Mumbai",    address:"12 Rose Lane",     pin:"400001", total:1748, status:"Delivered",  items:[{ productId:getP("HA-001")._id, productName:"Velvet Pearl Scrunchie",    price:299, qty:2 }, { productId:getP("RG-001")._id, productName:"Floral Midi Ring Set",      price:499, qty:1 }] },
      { customer:"Aisha Sharma",    email:"aisha@email.com",  phone:"9812345678", city:"Delhi",     address:"45 Gold Street",   pin:"110001", total:2197, status:"Shipped",    items:[{ productId:getP("BR-001")._id, productName:"Rose Quartz Bead Bracelet",price:799, qty:1 }, { productId:getP("ER-001")._id, productName:"Pearl Drop Earrings",       price:649, qty:2 }] },
      { customer:"Riya Patel",    email:"riya@email.com",   phone:"9898989898", city:"Ahmedabad", address:"7 Petal Avenue",   pin:"380001", total:648,  status:"Processing", items:[{ productId:getP("HA-003")._id, productName:"Satin Ribbon Headband",    price:349, qty:1 }, { productId:getP("ER-007")._id, productName:"Huggie Hoop Charm",         price:399, qty:1 }] },
      { customer:"Ananya Roy",    email:"ananya@email.com", phone:"9765432109", city:"Kolkata",   address:"2 Bow Circle",     pin:"700001", total:1299, status:"Pending",    items:[{ productId:getP("BG-001")._id, productName:"Monogram Canvas Tote",     price:1299,qty:1 }] },
      { customer:"Sneha Gupta",   email:"sneha@email.com",  phone:"9654321098", city:"Pune",      address:"88 Blossom Road",  pin:"411001", total:3896, status:"Delivered",  items:[{ productId:getP("NK-001")._id, productName:"Layered Gold Necklace Set", price:899, qty:1 }, { productId:getP("BG-002")._id, productName:"Mini Crossbody Pouch",      price:899, qty:2 }, { productId:getP("SG-001")._id, productName:"Butterfly Frame Sunnies",   price:1199,qty:1 }] },
      { customer:"Meera Singh",    email:"meera@email.com",  phone:"9543210987", city:"Bangalore", address:"33 Jasmine Park",  pin:"560001", total:998,  status:"Delivered",  items:[{ productId:getP("HA-004")._id, productName:"Silk Scrunchie Trio",      price:399, qty:1 }, { productId:getP("BR-004")._id, productName:"Crystal Tennis Bracelet",   price:999, qty:1 }] },
      { customer:"Diya Singh",    email:"diya@email.com",   phone:"9432109876", city:"Hyderabad", address:"19 Pearl Street",  pin:"500001", total:1248, status:"Shipped",    items:[{ productId:getP("SG-002")._id, productName:"Cat-Eye Retro Shades",     price:999, qty:1 }, { productId:getP("BR-006")._id, productName:"Enamel Flower Bangle",      price:549, qty:1 }] },
    ];

    await Order.insertMany(ORDERS);
    console.log(`📋  Inserted ${ORDERS.length} sample orders`);

    console.log("\n🌸  Seed complete! Run `npm run dev` to start the server.\n");
    process.exit(0);
  } catch (err) {
    console.error("❌  Seed failed:", err.message);
    process.exit(1);
  }
}

seed();