const Campground = require("../models/campground"),
  Comment = require("../models/comment");

var middlewareObj = {
  checkCampgroundOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, campground) => {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          if (campground.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("back");
    }
  },
  checkCommentOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          // console.log(comment.author.id);
          // console.log(req.params.comment_id);
          // console.log(req.user._id.toString());
          if (comment.author.id.equals(req.user._id)) {
            next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("back");
    }
  },

  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },
};

module.exports = middlewareObj;
