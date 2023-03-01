const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userCtrl");
router.post("/signup", userCtrl.addNewUser);
router.post("/checkEmail", userCtrl.checkEmail);
router.post("/checkOut", userCtrl.addOrder);
router.post("/getAllOrder", userCtrl.getAllOrder);
router.post("/orderDetail", userCtrl.getOrderDetail);
router.post("/saveCart", userCtrl.saveCart);

module.exports = router;
