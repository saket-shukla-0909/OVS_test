const express = require("express");
const router = express.Router();
const VendorsControllers = require("../controllers/VendorsControllers");

router.post('/register', VendorsControllers.vendorRegister);;
router.post('/login', VendorsControllers.vendorLogin);

module.exports = router;