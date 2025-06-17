const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");
const { name } = require("ejs");
// const { log } = require("console");
// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, _, next) => {
  User.findById("6851a567d67eee23e62801a6")
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch(console.error);
});

// app.use((req, _, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       req.user = user;
//       console.log("app user", user);

//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);

// Cart.hasMany(CartItem);
// CartItem.belongsTo(Cart);

// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// sequelize
//   .sync()
//   .then((result) => {
//     console.log("Connnected to the db");
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({
//         firstName: "Bappi",
//         email: "cs.bappirahman@gmail.com",
//       });
//     }
//     return user;
//   })
//   .then((user) => {
//     // console.log(user);
//     user.createCart();
//     app.listen(3000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

mongoose
  .connect(process.env.mongo_url)
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "bappi",
          email: "cs.bappirahman@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log("Connected successfully");
  })
  .catch(console.error);
