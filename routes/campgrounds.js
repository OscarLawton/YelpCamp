var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// Index route
router.get("/", function(req,res){

	//res.render("campgrounds",{data: cg_array});
	//console.log("campgrounds");
	Campground.find({}, function(err,allCampgrounds){
		if(err){
			console.log("there was an error");
			console.log(err);
		} else {
			
				res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
			
			
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: description, author: author};
	//cg_array.push(newCampground);
	Campground.create(newCampground, function(err, newCreated){
		if(err){
			console.log("there was an error");
			console.log(err);
		} else {
			console.log("campground crated");
			console.log(newCreated);
			res.redirect("/campgrounds");
		}
	});
	//res.send("you hit the post route");
	//res.redirect("/campgrounds");
});

router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new.ejs");
});

router.get("/:id", function(req, res){
	//res.send("This will the show page and styuff");
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
		
			res.render("campgrounds/show.ejs", {campground:foundCampground});
		}
	});

	//res.render("show");
});
/*
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
	console.log("did this run? 6th of aug")
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
			console.log(foundCampground);
            res.render("show", {campground: foundCampground});
        }
    });
});
*/

// Edit Campgrounds
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});

});
// Update Campgrounds 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
		
	});
});


module.exports = router;