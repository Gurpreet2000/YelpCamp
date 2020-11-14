const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground");

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

router.post("/", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {
    name: name,
    image: image,
    description: description,
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

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
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

module.exports = router;
