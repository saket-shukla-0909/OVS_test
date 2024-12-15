const mongoose = require("mongoose");

// Define Schema
const productSchema = new mongoose.Schema({
    vendorid: {
        type: mongoose.Schema.Types.ObjectId, // Reference another document
        ref: 'Vendor', // Name of the referenced model
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        unique: true, // Ensure unique email
    },
    stock: {
        type: Number,
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create Model
const Product = mongoose.model('Product', productSchema);

// Export Model
module.exports = Product;

