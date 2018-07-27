// --- BLOG-APP --- //

var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();


// APP CONFIG
// Connect to db
mongoose.connect("mongodb://localhost:27017/blog_app", { useNewUrlParser: true });
// View every page as an ejs page
app.set("view engine", "ejs");
// Costume styles in the public directory
app.use(express.static("public"));
// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));



// MONGOOSE CONFIG
// Create schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);



// ROUTES
// Redirect to index.ejs
app.get("/", function(req, res) {
    res.render("index");
});
// Index route
app.get("/blogs", function(req, res) {
    Blog.find({}, function(error, blogs) {
        if (error) {
            console.log("Oops, there's something wrong");
            console.log(error);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});
// New route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});
// Create route
app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(error, newBlog) {
        if (error) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });

    
});


// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});


