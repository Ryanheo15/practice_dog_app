//INIT
//general require
let express = require("express");
let mongoose = require("mongoose");
let ejs = require("ejs");
let bodyParser = require("body-parser");
let methodOverride = require("method-override");
let flash = require("connect-flash");

//passport require
let passport = require("passport");
let localStrategy = require("passport-local").Strategy;
let passportLocalMongoose = require("passport-local-mongoose");
let expressSession = require("express-session");

//routes setup
let dogRoutes = require("./routes/dogs.js");
let commentRoutes = require("./routes/comment.js")
let indexRoutes = require("./routes/index.js");

//mongoose
mongoose.connect("mongodb://localhost:27017/dog_adoption_app", {useNewUrlParser: true, useUnifiedTopology: true});

//models
let dogModel = require("./models/dogModel.js");
let commentModel = require("./models/commentModel.js");
let userModel = require("./models/userModel.js");

//app setup
let app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//passport setup
app.use(expressSession({
  secret: "xhyszerkfoajsjdffhafni39djs",
  resave: false,
  saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//local variables
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

//ROUTES
app.use(dogRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

//LISTEN
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
