const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

router.get("/", (req, res) => {
  res.render("landing");
});

//============
//Auth routes
//============

//show register form
router.get("/register", (req, res) => {
  res.render("register");
});

//handle signup logic
router.post("/register", (req, res) => {
  let newUser = new User({ username: req.body.username });
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
  res.render("login");
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

module.exports = router;
