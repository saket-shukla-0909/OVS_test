const express = require("express");
const ProductsController = require("../controllers/ProductsControllers");
const router = express.Router();

router.post('/addProduct', ProductsController.addNewProducts);
router.get('/getProduct', ProductsController.getallProducts);
router.delete('/deleteProduct', ProductsController.deleteSingle);
router.patch('/updateProduct', ProductsController.updateProduct);

module.exports = router;