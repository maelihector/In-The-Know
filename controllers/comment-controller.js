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

  // A POST route for saving a comment to the db and associating it with a Headline
  app.post("/submit", function (req, res) {
    // Create a new comment and pass the req.body to the entry
    db.Comment.create(req.body)
      // .then(function (dbComment) {
      //   return db.User.findOneAndUpdate({
      //     // find the user posting the comment
      //     _id: "5b1fe6ca39412804f7647b50"
      //   }, {
      //     // then push the new comment's _id to the user's `comments` array
      //     $push: {
      //       comments: dbComment._id
      //     }
      //   }, {
      //     // tell the query to return the updated Document rather that returning the original by default
      //     new: true
      //   })
      // })
      .then(function (dbComment) {
        return db.Headline.findOneAndUpdate({
          // find the headline associated with the comment
          _id: "5b2002f2eb2a130788fb21fe"
        }, {
          // then push the new comment's _id to the headlines's `comments` array
          $push: {
            comments: dbComment._id
          },

          // tell the query to return the updated Document rather that returning the original by default
          new: true

        })
      })
      .then(function (dbHeadline) {
        // If successful, send it back to the client on index.hbs
        res.json(dbHeadline);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for deleting a specific comment by id
  app.get("/removeComment/:id", function (req, res) {
    db.Comment.findOneAndDelete({
        _id: req.params.id
      }).then(function (dbHeadline) {
        return db.Headline.findOneAndUpdate({
          // find the headline that matches its '_id'
          _id: req.body.id
          // once matched, pull the headline's 'comments' field with 'dbComment._id' value
        }, {
          $pull: {
            comments: dbComment._id
          }
        })
      }).then(function (dbUser) {
        return db.User.findOneAndUpdate({
          // find the headline that matches its '_id'
          _id: req.body.id
          // once matched, pull the headline's 'comments' field with 'dbComment._id' value
        }, {
          $pull: {
            comments: dbComment._id
          }
        })
      })
      .then(function (dbHeadline) {
        // If successful, send it back to the client on index.hbs
        res.render("user", {
          dbHeadline: dbHeadline
        });
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
    db.Comment.find({
        _id: req.params.id
      })
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