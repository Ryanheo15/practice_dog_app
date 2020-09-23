//Imports
let express = require("express");
let router = express.Router();

//Models
let dogModel = require("../models/dogModel.js");
let commentModel = require("../models/commentModel.js");

//middleware
let middlewareObj = require("../middleware/middleware.js");

//GET dogs
router.get("/dogs", middlewareObj.isLoggedIn,  (req, res) => {
  let currentUser = req.user;
  dogModel.find({}, (err, dogs) => {
    if(err){
      console.log(err);
    }
    else {
      res.render("dogs.ejs", {dogs: dogs, currentUser: currentUser, success: req.flash("success", "Successfully logged in")});
    }
  });
});

//POST dogs
router.post("/dogs", middlewareObj.isLoggedIn, (req, res) => {
  let name = req.body.name;
  let type = req.body.type;
  let image = req.body.image;
  let description = req.body.description;

  let author = {
    id: req.user.id,
    username: req.user.username
  }

  dogModel.create({
    name: name,
    type: type,
    description: description,
    image: image,
    author: author
  }, (err, dog) => {
    if(err){
      console.log(err);
    }
    else {
      res.redirect("/dogs");
    }
  });
});

//GET Dog form
router.get("/dogs/new", middlewareObj.isLoggedIn,  (req, res) => {
  let currentUser = req.user;
  res.render("new_dog.ejs", {currentUser: currentUser});
});

//SHOW dog
router.get("/dogs/:id", middlewareObj.isLoggedIn, (req, res) => {
  let id = req.params.id;
  let currentUser = req.user;

  dogModel.findById(id).populate("comments").exec((err, foundDog) => {
    if(err){
      console.log(err);
    }
    else {
      res.render("show_dog.ejs", {dog: foundDog, currentUser: currentUser});
    }
  });
});

//Edit dog page
router.get("/dogs/:id/edit", middlewareObj.dogAuthorization, (req, res) => {
  let id = req.params.id;

  dogModel.findById(id, (err, foundDog) => {
    if(err){
      console.log(err);
    }
    else {
      res.render("edit_dog.ejs", {dog: foundDog, currentUser: req.user});
    }
  });
})

//Update
router.put("/dogs/:id", middlewareObj.dogAuthorization ,(req, res) => {
  let id = req.params.id;
  let dog = {
    name: req.body.name,
    type: req.body.type,
    description: req.body.description
  }

  dogModel.findByIdAndUpdate(id, {  name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    image: req.body.image
  }, (err, foundDog) => {
    if(err){
      console.log(err);
    }
    else {
      res.redirect("/dogs");
    }
  })
});

//Delete dog
router.delete("/dogs/:id", middlewareObj.dogAuthorization ,  (req,res) => {
  let id = req.params.id;

  dogModel.findByIdAndDelete(id, (err, deletedDog) => {
    if(err){
      console.log(err);
    }
    else {
      commentModel.deleteMany({_id: {$in : deletedDog.comments}}, (err) => {
        if(err){
          console.log(err);
        }
        else {
          res.redirect("/dogs");
        }
      });
    }
  });
});

//exporting
module.exports = router;
