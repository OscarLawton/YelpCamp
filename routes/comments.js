var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn,  function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground})
		}
	});
	
	
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					// add id and username to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
				
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// Edit Comment 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err || !foundComment){
					console.log("did this run?");
					req.flash("error", "Comment not found");
					res.redirect("back");
				} else {
				
					res.render("comments/edit", {campground: foundCampground, comment: foundComment});
				}
			});
			
		}
	});
	
	
});
/*router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
	
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					console.log(err);
					console.log(" 56, this is what I'm looking to see: ", req.params.comment);
					res.redirect("back");
				} else {
					console.log(" 59, this is what I'm looking to see: ", foundComment);
					res.render("comments/edit", {campground: foundCampground, comment: foundComment});
				}
			});
			
		}
	});
	
	
});*/

// Update Comment
router.put("/:comment_id", function(req, res){
	
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log("an error happened")
			console.log(err);
			res.redirect("back")
		} else {
			req.flash("success", "Comment updated")
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});


// Delete Comment 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comments Deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});




module.exports = router;