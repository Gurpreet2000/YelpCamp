const mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  express = require("express"),
  app = express(),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds"),
  campgroundRoutes = require("./routes/campgrounds"),
  commentRoutes = require("./routes/comments"),
  indexRoutes = require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/yelp_camp", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });

mongoose.connect("mongodb+srv://yelpcamp:database@yelpcamp.njqf6.mongodb.net/yelpcamp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
console.log(__dirname);

// seedDB();

//Flash Config
app.use(flash());

//Exprerss Session Config
app.use(
  require("express-session")({
    secret: "This is my secret",
    resave: false,
    saveUninitialized: false,
  })
);

//Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("YelpCamp Server Has Started");
});
