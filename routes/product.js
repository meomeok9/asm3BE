const express = require("express");
const router = express.Router();
const productsCtrl = require("../controllers/productCtrl");

router.get("/getProductByCategory/:cate", productsCtrl.getProductByCate);
router.get("/getProducts", productsCtrl.getProducts);
router.get("/detail/:id", productsCtrl.detail);
router.post("/getProduct", productsCtrl.getProduct);
router.get("/related/:id", productsCtrl.related);
module.exports = router;
