const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authCtrl");
router.post("/signin", authCtrl.login);
router.get("/signout", authCtrl.logout);
module.exports = router;
