let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/dog_adoption_app");

let commentSchema = new mongoose.Schema({
  content: String,
  author: {
    id: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    username: String
  }
});

module.exports = mongoose.model("Comment", commentSchema);
