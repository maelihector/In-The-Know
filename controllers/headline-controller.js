// Dependencies
var express = require("express");
// Scraping tools
var cheerio = require("cheerio");
var request = require("request");
var axios = require("axios"); // Axios is a promise-based HTTP client that works both in the browser and in a node.js environment

// Require models
var db = require("../models");

// Export app to server.js
module.exports = function (app) {

  // A GET route for scraping the bbc news website
  app.get("/scrape", function (req, res) {

    axios.get("http://www.bbc.com/news").then(function (response) {
      // Load response into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Grab every div with class="gs-c-promo", which is where the headlines are
      $("div.gs-c-promo").each(function (i, element) {
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
          .then(function (dbHeadline) {
            // View the added result in the console
            console.log(dbHeadline);
          })
          .catch(function (err) {
            // If an error occurs, send it to the client
            return res.json(err);
          });
      });

      // If able to successfully scrape and save a Headline, send a message to the client
      res.send("Scrape Complete");
    });
  });


  // Route for getting all Headlines from the db
  app.get("/headlines", function (req, res) {
    // Grab every document in the Headlines collection
    db.Headline.find({})
      .then(function (dbHeadline) {
        // If we were able to successfully find Headlines, send them back to the client
        res.json(dbHeadline);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Headline by id, populate it with it's comment
  app.get("/headlines/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Headline.findOne({
        _id: req.params.id
      })
      // ..and populate all of the comments associated with it
      .populate("comment")
      .then(function (dbHeadline) {
        // If we were able to successfully find an Headline with the given id, send it back to the client
        res.json(dbHeadline);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

}