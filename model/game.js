const mongoose = require("mongoose");
const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name of the game"],
    unique: true,
    trim: true,
    maxlength: 20,
  },
  genre: {
    type: [],
    required: [true, "Please enter the genre of the game"],
    validate: [arrayLimit, "Cannot be more than 2 genres"],
  },
  price: {
    type: Number,
  },
  dateOfRelease: {
    type: String,
    required: [true, "Please enter date of purchase"],
  },
  profile: {
    type: mongoose.Schema.ObjectId,
    ref: "Profile",
    required: true,
  },
});

function arrayLimit(val) {
  return val.length <= 2;
}

GameSchema.statics.getAvgPrice = async function (profileId) {
  const obj = await this.aggregate([
    {
      $match: { profile: profileId },
    },
    {
      $group: { _id: "$profile", averageCost: { $avg: "$price" } },
    },
  ]);

  console.log(obj);
  try {
    await this.model("Profile").findByIdAndUpdate(profileId, {
      averageGamesPrice: obj[0].averageCost.toFixed(2),
    });
  } catch (e) {
    console.log(e.message);
  }
};

GameSchema.pre("save", function () {
  this.dateOfRelease instanceof Date;
  this.constructor.getAvgPrice(this.profile);
});

GameSchema.post("save", function () {
  this.constructor.getAvgPrice(this.profile);
});

module.exports = mongoose.model("Game", GameSchema);
