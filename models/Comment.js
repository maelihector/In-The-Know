var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new `CommentSchema` object
var CommentSchema = new Schema({

  // `user` is an object that stores a User id
  // The ref property links the ObjectId to the User model, which allows us to populate the Comment with an associated User
  
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  title: String,
  body: String
});

// This creates the model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;

