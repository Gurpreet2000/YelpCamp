const Campground = require("../models/campground"),
  Comment = require("../models/comment");

var middlewareObj = {
  checkCampgroundOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
          //console.log(err);
          req.flash("error", "Campground not found");
          res.redirect("/campgrounds");
        } else {
          if (campground.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that.");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that.");
      res.redirect("/login");
    }
  },
  checkCommentOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err || !comment) {
          //console.log(err);
          req.flash("error", "Comment not found");
          res.redirect("../../");
        } else {
          // console.log(comment.author.id);
          // console.log(req.params.comment_id);
          // console.log(req.user._id.toString());
          if (comment.author.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that.");
            res.redirect("../../");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that.");
      res.redirect("/login");
    }
  },

  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
  },
};

module.exports = middlewareObj;
