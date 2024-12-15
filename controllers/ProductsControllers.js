const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const Vendor = require("../modals/VendorsModal");
const Product = require("../modals/ProductsModal"); // Correct the path if necessary

exports.addNewProducts = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        // Validate input fields
        if (!name || !price || !stock) {
            return res.status(400).send('All fields are mandatory');
        }

        // Vendor token is required; pass through bearer token
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token is required." });
        }

        // Decode token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token." });
        }

        const email = decoded.email; // Ensure your token contains an email field
        if (!email) {
            return res.status(401).json({ message: "Token does not contain a valid email." });
        }

        // Vendor verification
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(404).send('Vendor not found');
        }

        // Create product data
        const productData = {
            vendorid: vendor._id,
            name,
            price,
            stock,
        };

        // Save product
        const product = new Product(productData);
        await product.save();
        res.status(201).send('Product is added successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

// Controllers - Get all Product
exports.getallProducts = async (req, res) => {
    try {
        // Vendor token is required; pass through bearer token
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token is required." });
        }

        // Decode token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.status(401).json({ message: "Invalid token." });
        }

        const email = decoded.email; // Ensure your token contains an email field
        if (!email) {
            return res.status(401).json({ message: "Token does not contain a valid email." });
        }

        // Vendor verification
        const isVendorExist = await Vendor.findOne({ email });
        if (!isVendorExist) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Fetch vendorId
        const vendorId = isVendorExist._id;

        // Get pagination parameters from the query string
        const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 products per page if not provided
        const skip = (page - 1) * limit;  // Calculate the number of products to skip

        // Fetch products with pagination
        const products = await Product.find({ vendorid: vendorId })
            .skip(skip)
            .limit(limit);

        // Return paginated products
        res.status(200).json({
            success: true,
            products,
            pagination: {
                page,
                limit,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Controllers - Delete single Product 
exports.deleteSingle = async (req, res) => {
    try {
        // Vendor token is required; pass through bearer token
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token is required." });
        }

        // Decode token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token." });
        }

        const email = decoded.email; // Ensure your token contains an email field
        if (!email) {
            return res.status(401).json({ message: "Token does not contain a valid email." });
        }

        // Vendor verification
        const isVendorExist = await Vendor.findOne({ email });
        if (!isVendorExist) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        const vendorId = isVendorExist._id; // Assuming the Vendor model has _id as VendorId
        const { productId } = req.body; // Product ID sent in the request body

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        // Delete the product associated with the VendorId
        const product = await Product.findOneAndDelete({ _id: productId, vendorid: vendorId });

        if (!product) {
            return res.status(404).json({ message: "Product not found or does not belong to the vendor." });
        }

        res.status(200).json({ message: "Product deleted successfully.", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token is required." });
        }

        // Decode token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token." });
        }

        const email = decoded.email; // Ensure your token contains an email field
        if (!email) {
            return res.status(401).json({ message: "Token does not contain a valid email." });
        }

        // Vendor verification
        const vendor = await Vendor.findOne({ email });
        if (!isVendorExist) {
            return res.status(404).json({ message: "Vendor not found." });
        }

        const vendorId = isVendorExist._id; // Assuming the Vendor model has _id as VendorId
        const { productId, name, price, stock } = req.body; // Example: productName is the unique identifier for the product

        // Find product by vendorId and productName
        const product = await Product.findOne({ _id: productId, vendorid: vendorId });
        if (!product) {
            return res.status(404).json({ message: "Product not found for this vendor." });
        }
        // Update product details
        const updateData = {
            name: name,
            price: price,
            stock: stock,
        }
        Object.assign(product, updateData); // Merge new data into the product
        await product.save();

        return res.status(200).json({ message: "Product updated successfully.", product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};
