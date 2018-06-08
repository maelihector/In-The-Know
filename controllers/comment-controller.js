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

  // A POST route for saving a headline's associated comment
  app.post("/submit", function (req, res) {
    // Create a new comment and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function (dbComment) {

        return db.Headline.findOneAndUpdate({
          // find the headline that matches its '_id'
          _id: "5b194cc644ee3f12e3797048" // req.params.id
          // once matched, push the headline's 'comments' field with 'dbComment._id' value
        }, {
          $push: {
            comments: dbComment._id
          }
        }).then(function () {

          return db.Comment.findOneAndUpdate({
            // use the newly created comment _id
            _id: dbComment._id
          }, {
            // add the updated headline._id to 'headline'
            headline: "5b194cc644ee3f12e3797048" // same as headline id above.
          })
        }).then(function (dbUser) {

          return db.User.findOneAndUpdate({
            // find the user that matches its '_id'
            _id: "5b1a7c329e601701e01e18ae" // req.params.id
            // once matched, push the headline's 'comments' field with 'dbComment._id' value
          }, {
            $push: {
              comments: dbComment._id
            }
          }, {
            // tell the query to return the updated Document rather that returning the original by default
            new: true
          })
        })
      })
      .then(function (dbHeadline) {
        // If successful, send it back to the client
        res.json(dbHeadline);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

// Route for getting all comments in comments collection
app.get("/comments", function (req, res) {
  // Grab every document in the comments collection
  db.Comment.find({})
    // populate the headline associated with it
    .populate("headline")
    .then(function (dbComment) {
      // If we were able to successfully find comments, send them back to the client
      res.json(dbComment);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting one comment by id in comments collection
app.get("/comments/:id", function (req, res) {
  // Grab every document in the comments collection
  db.Comment.find({_id: req.params.id})
    // populate the headline associated with it
    .populate("headline")
    .then(function (dbComment) {
      // If able to successfully find comments, send them back to the client
      res.json(dbComment);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
}