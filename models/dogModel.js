let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/dog_adoption_app");

let dogSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  image: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

module.exports = mongoose.model("dog", dogSchema);
