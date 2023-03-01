const Orders = require("../models/orders");
const User = require("../models/users");
const Products = require("../models/products");
const fsHelper = require("../util/file");
const path = require("path");
const ChatDatas = require("../models/chat-data");
const console = require("console");
const returnResults = (list, req, error) => {
  const listLeng = list.length;
  let page = req.params.page || 1;
  let numberReturn = req.params.numberReturn || 8;
  const total_pages = Math.ceil(listLeng / numberReturn);
  const results = list.filter(
    (m, i) => (page - 1) * numberReturn <= i && i < numberReturn * page
  );
  if (error) return { results, page, total_pages, message: error };
  return { results, page, total_pages, message: "SUCCESS" };
};

module.exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find();
    let orderRs = [];
    for (let i = 0; i < orders.length; i++) {
      const user = await User.findById(orders[i].userId);
      const clone = { ...orders[i]._doc };
      clone.userName = user.fullName;
      clone.phoneNumber = user.phoneNumber;
      orderRs.push(clone);
    }

    res.status(200).json({ message: "SUCCESS", results: orderRs });
  } catch (err) {
    res.status(400).json({ message: err, results: [] });
  }
};
module.exports.getInfomation = async (req, res) => {
  try {
    const users = await User.find();
    const orders = await Orders.find();
    const totalEarning = orders.reduce((sum, cur) => +cur.total + sum, 0);
    const thisMonth = new Date().getMonth(); //0~11
    const ordersThisMonth = orders.filter(
      (order) => order.createdAt.getMonth() === thisMonth
    );
    const earningThisMonth = ordersThisMonth.reduce(
      (sum, cur) => +cur.total + sum,
      0
    );
    res.status(200).json({
      message: "SUCCESS",
      results: {
        totalUser: users.length,
        totalOrder: orders.length,
        totalEarning,
        ordersThisMonth: ordersThisMonth.length,
        earningThisMonth,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err, results: [] });
  }
};
module.exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find();
    if (products.length === 0) throw new Error("no Product found!!");
    res.status(200).json({ message: "SUCCESS", results: products });
  } catch (err) {
    res.status(400).json({ message: err, results: [] });
  }
};
module.exports.addProducts = async (req, res) => {
  //const prod = req.body;
  const imgs = [];
  const name = req.body.name;
  const category = req.body.category;
  const inventory = req.body.inventory;
  const price = req.body.price;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;

  try {
    const img = await req.files;
    if (img && img.length === 4) {
      for (let i = 0; i < 4; i++) imgs.push(img[i].path.split("\\").join("/"));
    }
    if (imgs.length !== 0) {
      const newPrd = new Products({
        name,
        price,
        category,
        inventory,
        short_desc,
        long_desc,
        img1: imgs[0],
        img2: imgs[1],
        img3: imgs[2],
        img4: imgs[3],
      });
      await newPrd.save();
    }

    res.status(200).json({ message: "SUCCESS" });
  } catch (err) {
    console.log(err.message);
  }
};
module.exports.getEditProduct = async (req, res) => {
  const _id = req.body._id;
  try {
    const product = await Products.findById(_id);
    res.status(200).json({ message: "SUCCESS", results: product });
  } catch (err) {
    console.log(err.message);
  }
};
module.exports.postEditProduct = async (req, res) => {
  const prod = req.body;
  //console.log("prodct ::::::", prod);
  try {
    const existPrd = await Products.findById(prod._id._id);
    if (!existPrd) {
      return res.status(400).json({ message: "Cant find product" });
    } else {
      existPrd.name = prod.name;
      existPrd.price = prod.price;
      existPrd.inventory = prod.inventory;
      existPrd.category = prod.category;
      existPrd.short_desc = prod.short_desc;
      existPrd.long_desc = prod.long_desc;
      await existPrd.save();
      return res.status(200).json({ message: "SUCCESS" });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.postDelProduct = async (req, res, next) => {
  const _id = req.body._id;
  try {
    const prd = await Products.findById(_id);
    fsHelper.deleteFile(prd.img1);
    fsHelper.deleteFile(prd.img2);
    fsHelper.deleteFile(prd.img3);
    fsHelper.deleteFile(prd.img4);
    await Products.findByIdAndDelete(_id);
    const prods = await Products.find();
    res.status(200).json({ message: "SUCCESS", results: prods });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getMessages = async (req, res, next) => {
  try {
    const messages = await ChatDatas.find();
    const fakedata = [];
    for (let i = 0; i < messages.length; i++) {
      const existUser = await User.findById(messages[i].userId);
      fakedata[i] = { ...messages[i]._doc };
      fakedata[i].useName = existUser.fullName;
    }
    res.status(200).json({ message: "SUCCESS", results: fakedata });
  } catch (err) {
    console.log(err);
  }
};
module.exports.endChat = async (req, res, next) => {
  const roomId = req.params.roomId;
  try {
    await ChatDatas.findByIdAndDelete(roomId);
    const messages = await ChatDatas.find();
    const fakedata = [];
    for (let i = 0; i < messages.length; i++) {
      const existUser = await User.findById(messages[i].userId);
      fakedata[i] = { ...messages[i]._doc };
      fakedata[i].useName = existUser.fullName;
    }
    res.status(200).json({ message: "SUCCESS", results: fakedata });
  } catch (err) {
    console.log(err);
  }
};
