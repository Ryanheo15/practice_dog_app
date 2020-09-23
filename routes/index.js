//General setup
let express = require("express");
let router = express.Router();
let passport = require("passport");

//model
userModel = require("../models/userModel.js");

//middleware
middlewareObj = require("../middleware/middleware.js");

//INDEX
router.get("/", (req, res) => {
  let currentUser = req.user;
  res.render("index.ejs", {currentUser: currentUser});
});

router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

router.post("/signup", (req, res) => {
  userModel.register(new userModel({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName}), req.body.password, (err, user) => {
    if(err){
      req.flash("error", err.message);
      res.redirect("/signup");
    }
    else {
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Successfully signed up");
        res.redirect("/dogs");
      });
    }
  })
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post("/login", passport.authenticate("local",{
  successRedirect: "/dogs",
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: "Successfully logged in"
}),(req, res) => {
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out!");
  res.redirect("/");
});

router.get("*", (req, res) => {
  res.send("error page");
});


module.exports = router;
