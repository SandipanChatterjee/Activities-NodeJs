const Review = require("../model/review");
const Profile = require("../model/profile");
const Game = require("../model/game");
const asyncHandler = require("../middleware/asynchandler");

// @desc      Get all Revies
// @route     GET /api/v1/reviews
// @route     /api/v1/profile/:profileId/reviews
// @access    Private
exports.getAllReview = asyncHandler(async (req, res, next) => {
  if (req.params.profileId) {
    const reviews = await Review.findById(req.params.profileId);
    if (!reviews) {
      return res.status(401).json({
        message: "Review was not found",
      });
    }
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get all Review
// @route     GET /api/v1/review/:id
// @access    Private
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(401).json({
      message: "Review was not found",
    });
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      Create Review
// @route     POST /api/v1/profile/:profileId/review
// @access    Private

exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.profile = req.params.profileId;
  console.log(req.body.profile);
  const profile = await Profile.findById(req.params.profileId);
  if (!profile) {
    return res.status(401).json({
      message: "Profile was not found",
    });
  }

  console.log("profile::::::::::::::::", profile);

  const game = await Game.findById(req.body.game);

  console.log("game::::::::::::::::", game);

  if (!game) {
    return res.status(401).json({
      message: `Game with ${req.body.game} does not exits`,
    });
  }

  if (game.profile.toString() !== req.params.profileId) {
    return res.status(401).json({
      message: "This game does not belong to this user",
    });
  }

  const review = await Review.create(req.body);

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      update review
// @route     update /api/v1/review/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!review) {
    return res.status(401).json({
      message: "Review was not found",
    });
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc      delete review
// @route     delete /api/v1/review/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return res.status(401).json({
      message: "Review was not found",
    });
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});
