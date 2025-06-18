const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // console.log(req.get("Cookie").split()[0].split("=")[1]); // Extracting isLoggedIn's value from cookies

  res.render("auth/login", {
    pageTitle: "login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("6851a567d67eee23e62801a6")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.error(error);
    res.redirect("/");
  });
};
