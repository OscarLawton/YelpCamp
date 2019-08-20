var mongoose = require("mongoose");
//mongoose.set('useNewUrlParser', true);
//mongoose.connect("mongodb://localhost/cat_app");
//mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true);
db = mongoose.createConnection("mongodb://localhost/cat_app", { useNewUrlParser: true });

var catSchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

var Cat = db.model('Cat', catSchema);

/*var george = new Cat({
	name: "Bethany",
	age: 33,
	temperament: "Lovely girl"
});

george.save(function(err, cat){
	console.log("I can get this to run");
	if(err){
		console.log("something went wrong");
	} else {
		console.log("cat saved");
		console.log(cat);
	}
});
*/



Cat.find({}, function(err, cats){
	if(err){
		console.log("go fuck yourself");
		console.log(err);
	} else {
		console.log("cats and stuff");
		console.log(cats);
	}
});

console.log("The whole thing ran");