const fs = require("fs");
require("dotenv").config();
const express = require("express");
const authPage = require("./middleware/authPage");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const chatCrl = require("./controllers/chatCtrl");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const app = express();
const http = require("http");
const server = http.createServer(app);
const FRONTEND = process.env.CLIENT_FE;
const FRONTEND_ADMIN = process.env.CLIENT_ADMIN;
app.set("trust proxy", 1);
const corsOpts = {
  //origin: [FRONTEND, FRONTEND_ADMIN],
  origin: "*",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
};

const PORT = +process.env.PORT;
app.use(cors(corsOpts));

const URI = process.env.MONGODB_URI;
app.use("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./Views", "index.html"));
  //next();
});
const store = new MongoDBStore({
  uri: URI,
  collection: "secret",
  expires: 60 * 60 * 1000,
});

// const csurfProtection = csurf();

// const { ObjectID } = require("bson");
app.use(cookieParser());
app.use(bodyParser.json());
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    //console.log(file);
    cb(null, Date.now() + " - " + file.originalname);
  },
});

const upload = multer({ storage: fileStorage });
app.use(upload.array("image"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "/images")));
//use session
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60,
      //httpOnly: true,
    },
  })
);

// app.use(csurfProtection);
// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csurfToken = req.csrfToken();
//   next();
// });
app.use(productRoute);
app.use(userRoute);
app.use(authRoute);
app.use("/admin", adminRoute);
app.use(helmet());
app.use(compression());
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

mongoose.set("strictQuery", false);
mongoose
  .connect(URI) //
  .then((rs) => {
    const { Server } = require("socket.io");
    const io = new Server(server);
    io.on("connection", (socket) => {
      //console.log("user connected!!!!!!!!!");
      socket.on("chatMessage", (data) => {
        chatCrl
          .addMessage(data)
          .then((result) => chatCrl.getMessages())
          .then((mes) => {
            if (data.fromClient) {
              const result = mes.filter(
                (m) => m.userId.toString() === data.userId
              );
              io.emit("send-back-to-client", result);
              io.emit("send-back-from-server", {
                data: mes,
                newPostId: data.userId,
              });
            }
            if (data.toUser) {
              const result = mes.filter(
                (m) => m.userId.toString() === data.toUser
              );
              io.emit("send-back-to-client", result);
              io.emit("send-back-from-server", { data: mes });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
    server.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("fail to connect to MongoDB!!");
  });
