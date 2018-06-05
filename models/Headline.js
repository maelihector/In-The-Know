var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new UserSchema object
var HeadlineSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  imageURL: {
    type: String,
    required: true
  },
  // `comment` is an object that stores a comment id
  // The ref property links the ObjectId to the comment model
  // This allows us to populate the Headline with an associated comment
  // comment: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Comment"
  // }
});

// Create model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", HeadlineSchema);

// Export the Headline model
module.exports = Headline;
