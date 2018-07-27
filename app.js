// --- BLOG-APP --- //

var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expessSanitizer = require("express-sanitizer"),
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
// Use express-sanitixer
app.use(expessSanitizer());
// Use method-override
app.use(methodOverride("_method"));



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
// Redirect to /blogs
app.get("/", function(req, res) {
    res.redirect("/blogs");
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
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(error, newBlog) {
        if (error) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// Show route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(error, foundBlog) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// Edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(error, foundBlog) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// Update route
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(error) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});



// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});


