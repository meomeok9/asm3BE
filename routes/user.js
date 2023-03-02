const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userCtrl");
const authPage = require("../middleware/authPage");
router.post("/signup", userCtrl.addNewUser);
router.post("/checkEmail", userCtrl.checkEmail);
router.post(
  "/checkOut",
  authPage(["admin", "counselors", "customer"]),
  userCtrl.addOrder
);
router.post(
  "/getAllOrder",
  authPage(["admin", "counselors", "customer"]),
  userCtrl.getAllOrder
);
router.post(
  "/orderDetail",
  authPage(["admin", "counselors", "customer"]),
  userCtrl.getOrderDetail
);
router.post(
  "/saveCart",
  authPage(["admin", "counselors", "customer"]),
  userCtrl.saveCart
);

module.exports = router;
