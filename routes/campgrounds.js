const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  middleware = require("../middleware");

router.get("/", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(campgrounds);
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    image: image,
    description: description,
    author: author,
  };
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(name + " " + image);
      res.redirect("/campgrounds");
    }
  });
});

router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, campground) => {
      if (err) {
        console.log("Error");
      } else {
        //console.log(campground);
        res.render("campgrounds/show", { campground: campground });
      }
    });
});

//Edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render("campgrounds/edit", { campground: campground });
  });
});

//Update
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds/");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Destroy
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
