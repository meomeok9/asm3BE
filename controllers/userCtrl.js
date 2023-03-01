const User = require("../models/users");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Orders = require("../models/orders");
const Products = require("../models/products");
const Cart = require("../models/cart");

let transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: "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",
  },
});

module.exports.addNewUser = async (req, res, next) => {
  const user = req.body;
  user.passWord = await bcrypt.hash(user.passWord, 12);

  const existUser = await User.find({ email: user.email });
  if (existUser.length !== 0) {
    return res.status(400).json({
      message: "Email is exists, Please choose an other Email or Login!",
    });
  } else {
    const newUser = new User(user);
    newUser.save();
    return res.status(200).json({ message: "SUCCESS" });
  }
};

module.exports.checkEmail = async (req, res, next) => {
  const email = req.body.email;
  const existUser = await User.find({ email: email });
  if (existUser.length !== 0) {
    return res.status(200).json({
      message: "Email is exists, Please choose an other Email or Login!",
    });
  } else {
    return res.status(200).json({ message: "SUCCESS" });
  }
};

module.exports.addOrder = async (req, res, next) => {
  const {
    fullName,
    email,
    phoneNumber,
    address,
    userId,
    items,
    total,
    delivery,
    state,
  } = req.body;
  //console.log("req data ----", req.body);

  try {
    const existsUser = await User.findById(userId);
    if (!existsUser) {
      return res.status(403).json({ message: "User not exist!" });
    }
    existsUser.fullName = fullName || existsUser.fullName;
    existsUser.email = email;
    existsUser.phoneNumber = phoneNumber || existsUser.phoneNumber;
    existsUser.address = address;
    await existsUser.save();
    for (let i = 0; i < items.length; i++) {
      const prd = await Products.findById(items[i].productId);
      prd.inventory -= items[i].quan;
      if (prd.inventory < 0)
        return res
          .status(400)
          .json({ message: "Out of inventory, can not make order!" });
      await prd.save();
    }
    const newOrder = new Orders({
      userId,
      delivery,
      total,
      items,
      state,
      address,
    });
    await newOrder.save();
    //clear cart
    const existCart = await Cart.findOne({ userId });
    if (!existCart) return;
    existCart.items = [];
    existCart.save();
    const getItem = async (id) => {
      return await Products.findById(id);
    };

    //send email
    transporter.sendMail(
      {
        from: "hoannmgc00084@gmail.com", // verified sender email
        to: email, // recipient email
        subject: "Order", // Subject line
        text: `Xin Chào ${existsUser.fullName}`, // plain text body
        html: `<p>Phone :${existsUser.phoneNumber}</p>
              <p>Address: ${existsUser.address} </p>
              <table> 
                <tr>
                  <th>Tên Sản Phẩm</th>
                  <th>Hình Ảnh</th>
                  <th>Giá</th>
                  <th>Số Lượng</th>
                  <th>Thành Tiền</th>
                </tr>

                ${items.map(
                  (item) => `<tr> 
                  <td>${getItem(item.productId).name}</td>
                  <td><img src =${getItem(item.productId).img1}></td>
                  <td>${getItem(item.productId).price}</td>
                  <td>${item.quan}</td>
                  <td>${total}</td>
                </tr>`
                )}
              </table>
        `,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({ message: "A EMAIL SENT SUCCESS" });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: `Fail to add order! ` });
  }
};

module.exports.getAllOrder = async (req, res, next) => {
  const userId = req.body.userId;

  try {
    const orders = await Orders.find({ userId: userId });
    if (orders.length === 0) {
      return res.status(200).json({ message: "No order Found", results: [] });
    } else {
      return res.status(200).json({ message: "SUCCESS", results: orders });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getOrderDetail = async (req, res, next) => {
  const orderId = req.body.orderId;

  try {
    const orders = await Orders.findById(orderId);
    if (!orders) {
      return res.status(400).json({ message: "Fail to get Order" });
    } else {
      const clone = { ...orders._doc };
      const user = await User.findById(orders.userId);
      clone.useName = user.fullName;
      clone.phoneNumber = user.phoneNumber;
      return res.status(200).json({ message: "SUCCESS", results: clone });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.saveCart = async (req, res) => {
  const cart = req.body;
  // console.log(" request cart : ", cart);
  try {
    const existCart = await Cart.findOne({ userId: cart.userId });
    if (!existCart) {
      const newCart = new Cart(cart);
      newCart.save();
    } else {
      existCart.items = cart.items;
      existCart.save();
    }
    return res.status(200).json({ message: "SUCCESS" });
  } catch (err) {
    console.log(err);
  }
};
