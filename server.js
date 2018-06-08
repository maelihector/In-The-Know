// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan"); // Use morgan logger to help with debugging
var mongoose = require("mongoose"); // Use Mongoose for functionality in and around creating and working with Mongo DB schemas
// Scraping tools
var cheerio = require("cheerio"); 
var request = require("request");
var axios = require("axios"); // Axios is a promise-based HTTP client that works both in the browser and in a node.js environment

// Initialize Express
var app = express();
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local Mongo DB.
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Require models
var db = require("./models");

// Import Controllers/Routes
require("./controllers/headline-controller")(app);
require("./controllers/comment-controller")(app);
require("./controllers/user-controller")(app);          

// Start the server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
