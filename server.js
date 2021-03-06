const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/prop_bot');
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Chec for DB errors
db.on('error', function(err){
  console.log(err);
});

//Init App
const app = express();

// Bring in models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

// Set Public FormBuilder
app.use(express.static(path.join(__dirname, 'public')));

//Home Route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Articles',
        articles: articles
      });
    }
  });
});

// Add Route
app.get('/articles/add', function(req, res){
  res.render('add_article',{
    title:'Add Article'
  });
});

// Add single article
app.get('/article/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
      res.render('article', {
        article:article
      });
    });
});


//Add Submit POST Route
app.post('/articles/add', function(req, res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if(err){
      console.log(err);
    }else {
      res.redirect('/');
    }
  });

});

// edit a article
app.get('/article/edit/:id', function(req, res){
  console.log('inside the function')
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      article:article
    });
  });
});

// Start Server
app.listen(3000, function(){
  console.log('server started on port 3000...');
});
