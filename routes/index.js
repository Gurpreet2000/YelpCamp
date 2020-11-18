const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user"),
  Campground = require("../models/campground");

router.get("/", (req, res) => {
  res.render("landing");
});

//============
//Auth routes
//============

//show register form
router.get("/register", (req, res) => {
  res.render("register", { page: "register" });
});

//handle signup logic
router.post("/register", (req, res) => {
  let newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar,
  });
  //eval(require("locus"));
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      //console.log(err);
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", `Welcome to YelpCamp ${user.username}.`);
      res.redirect("/campgrounds");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login", { page: "login" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    // successFlash: `Successfully Logged In.`,
    // successRedirect: "/campgrounds",
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}.`);
    res.redirect("/campgrounds");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

//users profile
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err || !user) {
      req.flash("error", "User Not Found.");
      res.redirect("/");
    } else {
      Campground.find()
        .where("author.id")
        .equals(user._id)
        .exec((err, campgrounds) => {
          if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/");
          } else {
            res.render("users/show", { user: user, campgrounds: campgrounds, page: req.params.id });
          }
        });
    }
  });
});

module.exports = router;
