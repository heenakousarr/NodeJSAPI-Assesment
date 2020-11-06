var expressSanitizer = require('express-sanitizer'),
methodOverride = require('method-override'),
bodyParser = require('body-parser'),
mongoose       = require('mongoose')
express        = require('express'),
app            = express();

mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// Creating a blog schema
var blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  created: {type: Date, default: Date.now}
});

// Compiling the blog schema into a Blog model that can be used to create, read, update and delete blogs in the DB.
var Blog = mongoose.model('Blog', blogSchema);

// Root API
app.get('/', function(req, res) {
  res.redirect('/blogs');
})

// Home page
app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

// New Blog
app.get('/blogs/new', function(req, res) {
  res.render('new');
});

// Creating restful blog
app.post('/blogs', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog) {
    if(err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  }) 
});

// Displaying restful blog
app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  })
});

// Editing restful blog
app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: foundBlog});
    }
  })
});

// Updating restful blog
app.put('/blogs/:id', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  })
});

// Deleting restful blog
app.delete('/blogs/:id', function(req, res) {
  // delete blog
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  })

});

// Server starting on port 3000
app.listen(3000, function(req, res) {
  console.log("Blog App Server is Running...")
})
