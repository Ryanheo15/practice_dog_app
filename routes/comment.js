//Init
let express = require("express");
let router = express.Router({mergeParams: true});

//Models
let dogModel = require("../models/dogModel.js");
let commentModel = require("../models/commentModel.js");

//middleware
let middlewareObj = require("../middleware/middleware.js");

//Routes

//posting comment data
router.post("/dogs/:id/comments", middlewareObj.isLoggedIn, (req, res) => {
  let currentUser = req.user;
  let id = req.params.id;

  dogModel.findById(id, (err, foundDog) => {
    if(err){
      console.log(err);
    }
    else {
      let content = req.body.content;
      commentModel.create({content: content}, (err, comment) => {
        if(err){
          console.log(err);
        }
        else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          foundDog.comments.push(comment);
          foundDog.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/dogs/" + id);
        }
      });
    }
  });
});

//Deleting comment
router.delete("/dogs/:id/comments/:comment_id", middlewareObj.commentAuthorization, (req, res) => {
  let id = req.params.id;
  let comment_id = req.params.comment_id;
  commentModel.findByIdAndDelete(comment_id, (err) => {
    if(err){
      console.log(err);
      res.redirect("back");
    }
    else {
      req.flash("success", "Successfully deleted comment");
      res.redirect("/dogs/" + id);
    }
  });
});

//Export
module.exports = router;
