const Purchase = require("../models/Purchase"); // Corrected path if your model is in 'model' folder

// Get all purchases or filter by date/type
exports.getPurchases = async (req, res) => {
  try {
    const { date, equipmentType } = req.query;
    const filter = {};

    if (date) filter.purchaseDate = date; // Assuming date in query matches the format in DB
    if (equipmentType) filter.equipmentType = equipmentType;

    const purchases = await Purchase.find(filter);
    res.json(purchases);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    res.status(500).json({ error: "Failed to fetch purchases." });
  }
};

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    const saved = await newPurchase.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating purchase:", err);
    res.status(400).json({ error: "Invalid purchase data." });
  }
};