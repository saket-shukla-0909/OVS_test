const Order = require('../modals/OrderModal'); 
const Product = require("../modals/ProductsModal");


// I have made this controllers for testing purpose of getAllOrders controllers && make order as a shipped
// Add a new order
exports.addOrders = async (req, res) => {
    try {
        const { productId, quantity, totalprice, status } = req.body;

        if (!productId || !quantity || !totalprice) {
            return res.status(400).send('Product ID, quantity, and total price are mandatory');
        }
        const orderData = { productId, quantity, totalprice, status };

        const order = new Order(orderData);
        await order.save();

        res.status(201).json({ success: true, message: 'Order created successfully', data: order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal server error');
    }
};

// Retrieve all orders with product details
exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 orders per page if not provided
        const skip = (page - 1) * limit; // Calculate number of orders to skip

        // Fetch orders with pagination
        const orders = await Order.find()
            .skip(skip)
            .limit(limit);

        const ordersWithProductDetails = await Promise.all(
            orders.map(async (order) => {
                // Since order.productId is a single ObjectId, query directly with that
                const product = await Product.findById(order.productId);

                return {
                    orderId: order.id,
                    product: {
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                    },
                    quantity: order.quantity,
                    totalprice: order.totalprice,
                    status: order.status,
                };
            })
        );

        res.status(200).json({
            success: true,
            message: 'Orders retrieved successfully',
            data: ordersWithProductDetails,
            pagination: {
                page,
                limit,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

// Marked As A Shipped

exports.markOrderAsShipped = async (req, res) => {
    try {
        const  id  = req.params.id  // Get the ID from request parameters


        // Find the order by ID and update the status to 'shipped'
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: 'shipped' },  // Set the status to shipped
            { new: true }  // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Return success response with the updated order details
        res.status(200).json({
            success: true,
            message: 'Order marked as shipped successfully',
            data: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};
