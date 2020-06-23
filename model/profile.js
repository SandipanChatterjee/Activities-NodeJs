const mongoose = require("mongoose");
var fs = require("fs");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    age: {
      type: Number,
      required: [true, "Please add your age"],
      min: [18, "Age must be above 18 years"],
    },
    gender: {
      type: String,
      required: [true, "Please add your gender"],
      enum: ["Male", "Female"],
    },
    phone: {
      type: Number,
      required: [true, "Please add mobile number"],
      maxlength: [10, "Mobile number cannot be more than 10 digits"],
    },
    address: {
      type: String,
      required: [true, "please enter your address"],
    },
    jobs: {
      type: [],
      required: [true, "Please enter at lease 1 job"],
      default: undefined,
    },
    averageGamesPrice: {
      type: Number,
      min: [1, "Price cannot be less than 1"],
    },
    averageGamesRating: {
      type: Number,
      min: [1, "Rating cannot be less than 1"],
    },
    profilePicture: { data: String, contentType: String },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

profileSchema.methods.storeImage = function (path) {
  this.profilePicture.data = path;
  this.profilePicture.contentType = "image/png";
};

profileSchema.virtual("game", {
  ref: "Game",
  localField: "_id",
  foreignField: "profile",
  justOne: false,
});

module.exports = mongoose.model("Profile", profileSchema);
