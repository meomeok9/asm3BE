const User = require("../models/users");
const bcrypt = require("bcryptjs");
const Cart = require("../models/cart");
const jwt = require("jsonwebtoken");
const Scr = require("../models/secret");
module.exports.login = async (req, res, next) => {
  const e = req.body.email;
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const passWord = req.body.passWord;
  const isAdminApp = req.body.isAdminApp;
  const existUser = await User.findOne({ email: e });
  //console.log(req.body);
  let useCart;
  if (existUser) useCart = await Cart.findOne({ userId: existUser._id });
  if (!existUser) return res.status(401).json({ message: "User Not Found!!!" });
  else {
    bcrypt
      .compare(passWord, existUser.passWord)
      .then((isMatch) => {
        if (isMatch) {
          req.session.isLoggedIn = true;
          req.session.user = existUser;
          req.session.save((err) => {
            if (err) console.log(err);
            //console.log(req.session);
            //return Secret.findOne({ session: req.session });
            const accessToken = jwt.sign(existUser._id.toString(), secret);
            if (!isAdminApp) {
              return res.status(200).send(
                JSON.stringify({
                  message: "SUCCESS",
                  results: {
                    user: existUser,
                    accessToken,
                    cart: useCart,
                  },
                })
              );
            } else {
              // đảm bảo chỉ admin và tư vấn viên lôgin đc
              if (
                existUser.role === "admin" ||
                existUser.role === "counselors"
              ) {
                return res.status(200).send(
                  JSON.stringify({
                    message: "SUCCESS",
                    results: {
                      user: existUser,
                      accessToken,
                      cart: useCart,
                    },
                  })
                );
              } else {
                return res.status(401).json({ message: "Some thing Wrong!!" });
              }
            }
          });
        } else return res.status(401).json({ message: "Some thing Wrong!!" });
      })
      .catch((err) => res.status(401).json({ message: err }));
  }
};
module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "SUCCESS" });
};
