const express = require('express');
const OrdersControllers = require('../controllers/OrdersControllers');
const router = express.Router();

router.post('/addOrders', OrdersControllers.addOrders);
router.get('/allOrders', OrdersControllers.getAllOrders);
router.put('/mark/:id', OrdersControllers.markOrderAsShipped);

module.exports = router;