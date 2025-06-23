const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// var sgTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

// const transporter = nodemailer.createTransport(sgTransport({}));

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((validPass) => {
          if (validPass) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.error(err);
              }
              return res.redirect("/");
            });
          }
          return res.redirect("/login");
        })
        .catch((error) => {
          console.error(error);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(req.body.password, 10)
        .then((hashedPassword) => {
          const user = new User({
            email: req.body.email,
            password: hashedPassword,
            cart: { item: [] },
          });
          return user.save();
        })
        .then(() => {
          return res.redirect("/login");
        })
        .catch(console.error);
    })
    .catch(console.error);
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset password",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error(err);
      res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1 * 60 * 60 * 1000; // 1 hours
        user.save();
        res.redirect(`/new-password/${token}`);
      })
      .catch(console.error);
  });
};

exports.getNewPassword = (req, res, next) => {
  User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New password",
        isAuthenticated: req.session.isLoggedIn,
        userId: user._id.toString(),
        token: req.params.token
      });
    })
    .catch(console.error);
};

exports.postNewPassword = (req, res, next) => {
  User.findById(req.body.userId)
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }
      if(user.token === req.params.token) {

        res.redirect("/login");
        bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
          user.password = hashedPassword; // c6
          user.save();
        });
      } else res.redirect('/login')

    })
    .catch(console.error);
};
