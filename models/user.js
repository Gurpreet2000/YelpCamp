const { schema } = require("./campground");

const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

UserSchema = new mongoose.Schema({
  username: String,
  passport: String,
  avatar: String,
  firstName: String,
  lastName: String,
  email: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
