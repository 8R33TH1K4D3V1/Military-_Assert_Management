const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  base: { type: String, required: true },
  equipmentType: { type: String, required: true },
  assetName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  purchaseDate: { type: String, required: true } // Storing as string to match your current frontend input type="date" value
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields automatically

module.exports = mongoose.model("Purchase", purchaseSchema);