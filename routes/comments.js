const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

// COMMENTS ROUTES

router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash("error", "Something went wrong.");
      console.log(err);
      res.redirect(`/campgrounds`);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong.");
          console.log(err);
        } else {
          // add usernmae and id to comment
          //console.log("req.user -> " + req.user);
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Sucessfully added comment.");
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      });
    }
  });
});

//Edit

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err || !campground) {
      req.flash("error", "Campground not found.");
      return res.redirect("/campgrounds");
    }
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err || !comment) {
        //console.log(err);
        req.flash("error", "Comment not found.");
        res.redirect("/campgrounds/" + campground._id);
      } else {
        res.render("comments/edit", { campground_id: req.params.id, comment: comment });
      }
    });
  });
});

//Update

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      req.flash("success", "Campground updated.");
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

//Destroy

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted.");
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;
