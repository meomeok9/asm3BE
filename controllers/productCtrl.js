

const rs = (list, req, error) => {
  // hoac dung Product.find().skip((page - 1) * 8).limit(8)
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

const Products = require("../models/products");

module.exports.getProducts = async (req, res, next) => {
  try {
    const data = await Products.find();
    res.status(200).json(rs(data, req));
  } catch (err) {
    res.status(400).json(rs([], req, err.message));
  }
};
module.exports.getProductByCate = async (req, res, next) => {
  const cate = req.params.cate;

  try {
    const prods =
      cate === "all"
        ? await Products.find()
        : await Products.find({ category: cate });
    return res.status(200).json(rs(prods, req));
  } catch (err) {
    return res.status(400).json(rs([], req, err.message));
  }
};

module.exports.detail = async (req, res, next) => {
  try {
    const data = await Products.findById(req.params.id);
    if (!data) throw new Error("Cant found product!!");
    res.status(200).json({ message: "SUCCESS", results: data });
  } catch (err) {
    res.status(400).json({ message: err, results: [] });
  }
};
module.exports.getProduct = async (req, res, next) => {
  const id = req.body.id;

  try {
    const data = await Products.findById(id);

    if (!data) throw new Error("Cant found product!!");
    res.status(200).json({ message: "SUCCESS", results: data });
  } catch (err) {
    res.status(400).json({ message: err, results: [] });
  }
};

module.exports.related = async (req, res, next) => {
  try {
    const selectedPrd = await Products.findById(req.params.id);
    const prdCate = selectedPrd.category;
    const data = await Products.find({ category: prdCate });
    const results = data.filter((prd) => prd._id.toString() !== req.params.id);

    if (!data) throw new Error("Cant found product!!");
    res.status(200).json({ message: "SUCCESS", results });
  } catch (err) {
    res.status(400).json({ message: err, results: [] });
  }
};
