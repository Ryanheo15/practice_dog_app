//models
let dogModel = require("../models/dogModel.js");
let commentModel = require("../models/commentModel.js");

//middleware obj
let middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else {
    req.flash("error", "Please login first");
    res.redirect("/login");
  }
}

middlewareObj.dogAuthorization = function(req, res, next){
  let id = req.params.id;
  if(req.isAuthenticated()){
    dogModel.findById(id, (err, foundDog) => {
      if(err){
        req.flash("error", "Dog not found");
        res.redirect("back");
      }
      else {
        if(req.user._id && foundDog.author.id.equals(req.user._id)){
          next();
        }
        else {
          req.flash("error", "Not authorized");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
}

middlewareObj.commentAuthorization = function(req, res, next){
  let comment_id = req.params.comment_id;
  if(req.isAuthenticated()){
    commentModel.findById(comment_id, (err, foundComment) => {
      if(err){
        req.flash("Comment not found");
        res.redirect("back");
      }
      else {
        if(req.user && foundComment.author.id.equals(req.user._id)){
          next();
        }
        else {
          req.flash("Not authorized");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("You need to be logged in to do that");
    res.redirect("back");
  }
}

module.exports = middlewareObj;
