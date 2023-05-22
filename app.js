//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

// generate real text for home page
const homeStartingContent = "Welcome to our Blog: Exploring the Possibilities! Discover a world of knowledge, inspiration, and insightful perspectives on our blog. We are passionate about sharing valuable content that spans a wide range of topics, from technology and science to lifestyle and culture. Our blog is designed to captivate your curiosity, expand your horizons, and provide you with engaging reads that leave you inspired and informed."
const aboutContent = "Welcome to our blog! We are a passionate team of writers and enthusiasts dedicated to igniting curiosity and inspiring minds through our carefully curated content. Our mission is to provide a platform where knowledge meets creativity, and where ideas take flight. We hope you enjoy your stay and find our blog a valuable resource for expanding your horizons and broadening your mind!";
const contactContent = "Contact Information: Phone: +1 (555) 123-4567 Email: info@example.com Feel free to reach out to us with any inquiries, suggestions, or collaborations. We value your feedback and look forward to hearing from you."

const app = express();

app.set('view engine', 'ejs');
app.locals._ = _;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



const uri = "mongodb+srv://admin-sumit:come-on123@cluster0.5ensux9.mongodb.net/blogDB?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const postScema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postScema);


app.get("/", function (req, res) {
  
  Post.find({}).then((posts) => {
    res.render("home", { homeStartingContent: homeStartingContent, posts: posts });
  })
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  
  Post.findOne({_id: requestedPostId}).then((post) => {
    res.render("post", {post: post});
  }).catch((err) => console.log(err));
  
})



app.post("/", function (req, res) {
  // console.log(req.body.postTitle);
  // console.log(req.body.postBody);
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save().catch((err) => console.log(err));

  res.redirect("/");
  
})

const port = process.env.PORT || 3000;


app.listen(port, function () {
  console.log("Server started on port 3000");
});
