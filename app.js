const express = require("express"),
    app = express(),
    //bodyParser = require("body-parser"),
    mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350",
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!",
//     }, (err, campground) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(`Newly Created Campground
//             ${campground}`);
//         }
//     }
// );

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { campgrounds: campgrounds });
        }
    })
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log("Error");
        }
        else {
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