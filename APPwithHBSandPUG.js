/// NPM INSTALL --save BODY-PARSER

//npm install --save ejs pug express-handlebars                 :template implementing pug

// npm install --save express-handlebar@3.0
const express = require("express");

const path = require("path");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const bodyparser = require("body-parser");
const expressHbs = require("express-handlebars");
const app = express();
//use handlebars
app.engine(
  "hbs",
  expressHbs({
    layoutsDir: __dirname + "/views/layout",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
// use express template pug
//app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminData.router);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "404 page not found" });

  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
app.listen(3000);
