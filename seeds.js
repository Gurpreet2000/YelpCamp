const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

let data = [
  {
    name: "Cloud's Rest",
    price: "9.00",
    image:
      "https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1053&q=80",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    author: { id: "5fb27612bd03e1007f7e743f", username: "Harry Potter" },
  },
  {
    name: "Desert Mesa",
    price: "8.25",
    image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    author: { id: "5fb27612bd03e1007f7e743f", username: "Harry Potter" },
  },
  {
    name: "Canyon Floor",
    price: "11.09",
    image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    author: { id: "5fb2a62b3e74e9006e550a0f", username: "Dumbledore" },
  },
];

let seedDB = () => {
  Campground.deleteMany({}, (err) => {
    if (err) {
      throw err;
    } else {
      console.log("Campgrounds Removed");
      Comment.deleteMany({}, (err) => {
        if (err) {
          throw err;
        } else {
          console.log("Comments Removed");
        }
      });
      data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Added a campground");
            Comment.create(
              {
                text: "This place is great, bit I wish there was internet",
                author: { id: "5fb27612bd03e1007f7e743f", username: "Harry Potter" },
              },
              (err, comment) => {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment");
                }
              }
            );
          }
        });
      });
    }
  });
};

module.exports = seedDB;
