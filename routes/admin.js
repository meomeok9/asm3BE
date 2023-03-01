const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminCtrl");
// phân quyền : authPage chỉ cho user login và đc luu trong req.user,
// có role trong hàm đc sử dụng route
const authPage = require("../middleware/authPage");
router.get(
  "/getOrders",
  authPage(["admin", "counselors"]),
  adminCtrl.getOrders
);
router.get(
  "/getInfomation",
  authPage(["admin", "counselors"]),
  adminCtrl.getInfomation
);
router.get(
  "/getProducts",
  authPage(["admin", "counselors"]),
  adminCtrl.getProducts
);
router.post("/addProducts", authPage(["admin"]), adminCtrl.addProducts);
router.post("/getEditProduct", authPage(["admin"]), adminCtrl.getEditProduct);
router.post("/postEditProduct", authPage(["admin"]), adminCtrl.postEditProduct);
router.delete("/deleteProduct", authPage(["admin"]), adminCtrl.postDelProduct);
router.get(
  "/getMessages",
  authPage(["admin", "counselors"]),
  adminCtrl.getMessages
);
router.get(
  "/endChat/:roomId",
  authPage(["admin", "counselors"]),
  adminCtrl.endChat
);
module.exports = router;
