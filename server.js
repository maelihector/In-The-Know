var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local Mongo DB.
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping the bbc news website
app.get("/scrape", function(req, res) {

  axios.get("http://www.bbc.com/news").then(function(response) {
    // Load response into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    
    // Grab every div with class="gs-c-promo", which is where the headlines are
      $("div.gs-c-promo").each(function(i, element) {
        // Save an empty result object
        let result = {};
        
        result.title = $(this)
        .children("div.gs-c-promo-body").find("h3")
        .text();
        
        result.summary = $(this)
        .children("div.gs-c-promo-body").find("p")
        .text();
        
        result.link = $(this)
        .children("div.gs-c-promo-body").find("a")
        .attr("href");
        
        // imageURL is currently only working right for the first headline
        result.imageURL = $(this)
        .children("div.gs-c-promo-image").find("img")
        .attr("src");
        
        // Create a new Headline using the `result` object built from scraping
        db.Headline.create(result)
        .then(function(dbHeadline) {
          // View the added result in the console
          console.log(dbHeadline);
        })
        .catch(function(err) {
          // If an error occurs, send it to the client
          return res.json(err);
        });
      });

    // If able to successfully scrape and save a Headline, send a message to the client
    res.send("Scrape Complete");
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
