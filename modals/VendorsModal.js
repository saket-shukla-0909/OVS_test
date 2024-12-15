const mongoose = require("mongoose");

// Define Schema

const vendorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    token: String
});
// Create Model

const Vendor = mongoose.model('Vendor',vendorSchema);

// Export Model
module.exports = Vendor;
