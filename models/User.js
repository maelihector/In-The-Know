var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new `UserSchema` object
var UserSchema = new Schema({

  // `trim:` will trim leading and trailing whitespace before it's saved
  // `required:` is a required field and throws a custom error message if not supplied
  name: {
    type: String,
    trim: true,
    required: "First Name is Required"
  },
  
  username: {
    type: String,
    trim: true,
    // `unique` prevents duplicate usernames from being added to the server
    unique: true,
    required: "Username is Required"
  },

  // `password` uses a custom validation function to only accept values 6 characters or more
  password: {
    type: String,
    trim: true,
    required: "Password is Required",
    validate: [
      function (input) {
        return input.length >= 6;
      },
      "Password should be longer."
    ]
  },

  comments: [{
    // When user submits a comment, add and store the Comment ObjectID to `comments' array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Comment model
    ref: "Comment"
  }],

  savedHeadlines: [{
    // When user saves a headline, add and store to `savedHeadlines' array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Headline model
    ref: "Headline"
  }],

  userCreated: {
    type: Date,
    default: Date.now
  },

  lastUpdated: Date,
});

// Custom Instance Methods
// Custom method `lastUpdatedDate`
UserSchema.methods.lastUpdatedDate = function () {
  // Set the current user's `lastUpdated` property to the current date/time
  this.lastUpdated = Date.now();
  // Return this new date
  return this.lastUpdated;
};

// This creates the model from the above schema, using mongoose's model method
var User = mongoose.model("User", UserSchema);

// Export the Comment model
module.exports = User;