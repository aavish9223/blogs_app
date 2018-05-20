const express = require('express'),
mongoose = require('mongoose'),
methodOverride = require('method-override'),
bodyParser = require('body-parser'),
app = express();

mongoose.connect('mongodb://localhost/blog_app');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'));
app.use(methodOverride('_method'));

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', blogSchema);

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

//Index route (1st)
app.get('/blogs', (req, res) =>{
  Blog.find({}, (err, blogs) =>{
    if (err) {
      console.log(err);
    } else {
      res.render('blogs',{blogs: blogs});
    }
  });
});

//New route (2nd) 
app.get('/blogs/new', (req, res) =>{
  res.render('new');
});

//Create route (3rd)
app.post('/blogs', (req, res) =>{
  Blog.create(req.body.blog, (err, newBlog) =>{
    if (err) {
      res.redirect('/blogs/new');
    } else {
      res.redirect('/');
    }
  });
});

//Show route (4th)
app.get('/blogs/:id', (req, res) =>{
  Blog.findById(req.params.id, (err, foundBlog) =>{
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show',{blog: foundBlog});
    }
  });
});

//Show edit route (5th)
app.get('/blogs/:id/edit', (req, res) =>{
  Blog.findById(req.params.id, (err, foundBlog) =>{
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit',{blog: foundBlog});
    }
  });
});

//Update route (6th)
app.put('/blogs/:id', (req, res) =>{
  const blogId = req.params.id;
  const blog  = req.body.blog;

  Blog.findByIdAndUpdate(blogId, blog, (err, updatedBlog) =>{
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/'+blogId);
    }
  });
});

//Delete route (7th)
app.delete('/blogs/:id', (req, res) =>{
  const blogId = req.params.id;

  Blog.findByIdAndRemove(blogId, (err) =>{
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');      
    }
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
