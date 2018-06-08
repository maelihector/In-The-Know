var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new HeadlineSchema object
var HeadlineSchema = new Schema({

  // `unique` prevents duplicate Headlines from being added to the server
  // `required` s a required field and throws a custom error message if not supplied 
  title: {
    type: String,
    unique: true,
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

  comments: {
    // Store ObjectIds in the 'comments' array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Comment model
    ref: "Comment"
  }
});

// Create model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", HeadlineSchema);

// Export the Headline model
module.exports = Headline;