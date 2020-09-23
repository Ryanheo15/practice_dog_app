let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/dog_adoption_app", {useNewUrlParser: true, useUnifiedTopology: true});

let passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  age: Number,
  password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
