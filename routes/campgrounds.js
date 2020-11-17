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

//Create
router.post("/", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author,
  };
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      req.flash("error", "Campground not found.");
      console.log(err);
    } else {
      //console.log(name + " " + image);
      req.flash("success", "Sucessfully created campground.");
      res.redirect("/campgrounds");
    }
  });
});

router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, campground) => {
      if (err || !campground) {
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
        //console.log(err);
      } else {
        //console.log(campground);
        res.render("campgrounds/show", { campground: campground });
      }
    });
});

//Edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash("error", "Campground not found.");
      req.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", { campground: campground });
    }
  });
});

//Update
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
    if (err) {
      req.flash("error", "Campground not found.");
      console.log(err);
      res.redirect("/campgrounds/");
    } else {
      req.flash("success", "Campground updated.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Destroy
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      req.flash("error", "Campground not found.");
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground deleted.");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
