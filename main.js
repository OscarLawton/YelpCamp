var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var MethodOverride = require("method-override");
var flash = require("connect-flash");

// Routes Reuired 
var campgroundRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");


//mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true});
mongoose.connect("mongodb://Arbane:password1@ds233737.mlab.com:33737/yelplcamp");
//mongodb://Arbane:dRbLDbpGui@63st@ds233737.mlab.com:33737/yelplcamp

/*
Campground.create({name: "Goat Valley", img: "https://www.campsitephotos.com/photo/camp/82621/feature_Gold_Head_Branch_State_Park-f3.jpg", description: "This is a great place to meet Goats who are sinlge"}, function(err,campground){
	if(err){
		console.log("There was an error");
		console.log(err);
	} else {
		console.log("Item saved.");
		console.log(campground);
	}
});

/*var cg_array = [
	
		{name: "Salmon Creek", img: "https://www.campsitephotos.com/photo/camp/141211/feature_White_Spar-f2.jpg"},
		{name: "Goat Valley", img: "https://www.campsitephotos.com/photo/camp/82621/feature_Gold_Head_Branch_State_Park-f3.jpg"},
		{name: "Furry Grove", img: "https://www.campsitephotos.com/photo/camp/108653/feature_Blue_Lake_Basin-f3.jpg"}
	];*/

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))

//seedDB();

app.use(require("express-session")({
	secret:"Lucky is the cutest cat",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(MethodOverride("_method"));
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/campgrounds", campgroundRoutes);

/*

app.listen(3000,function(){
	console.log("It's alliiiiive!!!");
});

*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
 