const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");

seedDB();

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(campgrounds);
            res.render("index", { campgrounds: campgrounds });
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log("Error");
        }
        else {
            console.log(foundCampground);
            res.render("show", { campground: foundCampground });
        }
    });
});

app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: description,
    }
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(name + " " + image);
            res.redirect("/campgrounds");
        }
    });
});

app.listen(3000, () => {
    console.log("YelpCamp Server Has Started");
});