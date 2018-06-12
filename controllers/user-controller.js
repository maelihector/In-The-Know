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

  // Route for adding a user to the database
  app.post("/newUser", function (req, res) {
    db.User.create(req.body)
      .then(function (dbUser) {
  
          return db.User.find({})
       
          // populate all of the comments associated with each
          .populate("comments")
          .then(function (dbHeadline) {
            // If successful, send it back to the client on index.hbs
            res.render("user", {
              dbUHeadline: dbHeadline
            });
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      })
  });

  // Route for getting a specific User  with their respective 'savedHeadlines' array from the db
  app.get("/user/:id", function (req, res) {

    db.User.find({
        _id: req.params.id
      })
      // populate all of the comments associated with it
      .populate("savedHeadlines")
      .then(function (dbUser) {
        // If we were able to successfully find Headlines, send them back to the client
        res.json(dbUser);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for adding a specific Headline to 'savedHeadlines' array in a User Collection
  app.get("/saveHeadline/:id", function (req, res) {

    db.User.findOneAndUpdate({
        // find the user Document that is to be updated
        _id: req.params.id,

      }, {
        // add the Headline._id to their 'savedHeadlines' array
        // $addToSet prevents user from saving duplicate Headlines
        $addToSet: {
          savedHeadlines: req.body.id
        }
      }, {
        // tell the query to return the updated Document rather that returning the original by default
        new: true
      })
      .populate("savedHeadlines")
      .then(function (dbUser) {
        // If able to successfully pull array value, send back to the client
        res.json(dbUser);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for deleting a specific Headline from 'savedHeadlines' array in User's Collection
  app.get("/removeHeadline/:id", function (req, res) {

    db.User.findOneAndUpdate({
        // find the user Document that is to be updated
        _id: req.params.id
      }, {
        // remove the Headline._id from their 'savedHeadlines' array
        // $pull operator removes from an existing array all instances of a value or values that match a specified condition
        $pull: {
          savedHeadlines: req.body.id
        }
      }, {
        // tell the query to return the updated Document rather that returning the original by default
        new: true
      })
      .populate("savedHeadlines")
      .then(function (dbUser) {
        // If able to successfully pull array value, send back to the client
        res.json(dbUser);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
}