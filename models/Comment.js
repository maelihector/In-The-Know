var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new `CommentSchema` object
var CommentSchema = new Schema({

  // `headline` is an object that stores a Headline id that the comment was posted on
  // The ref property links the ObjectId to the User model, which allows us to populate the Comment with an associated User
  
  headline: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },

  title: String,
  body: String
});

// This creates the model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;

