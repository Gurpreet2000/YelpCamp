var campgrounds = [
    { name: "Samon Creek", img: "https://images.pexels.com/photos/2108709/pexels-photo-2108709.jpeg?auto=compress&cs=tinysrgb&h=350" },
    { name: "Granite Hill", img: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350" },
    { name: "Mountain Goat's Rest", img: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350" },
];
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", { campgrounds: campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var img = req.body.image;
    var newCampground = {
        name: name,
        img: img,
    }
    campgrounds.push(newCampground);
    console.log(name + " " + img);
    res.redirect("/campgrounds");
});

app.listen(3000, () => {
    console.log("YelpCamp Server Has Started");
});