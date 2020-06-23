const Profile = require("../model/profile");
const Game = require("../model/game");
const asyncHandler = require("../middleware/asynchandler");

// @desc      Get all Games
// @route     GET /api/v1/games
// @route     /api/v1/profile/:profileId/games
// @access    Private
exports.getGames = asyncHandler(async (req, res, next) => {
  if (req.params.profileId) {
    const game = await Game.find({ profile: req.params.profileId });
    res.status(200).json({
      success: true,
      data: game,
    });
  } else {
    // const game = await Game.find();
    // game.getAvgPrice();
    return res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single Game
// @route     GET /api/v1/games/:id
// @access    Private
exports.getGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).populate({
    path: "profile",
    select: "name",
  });

  if (!game) {
    return res
      .status(401)
      .json({ message: `Game with id ${req.params.id} not found` });
  }
  res.status(200).json({
    success: true,
    data: game,
  });
  // next();
});

// @desc      create new Game
// @route     POST /api/v1/profile/:profileId/games
// @access    Private
exports.createGame = asyncHandler(async (req, res, next) => {
  req.body.profile = req.params.profileId;
  const profile = await Profile.findById(req.params.profileId);
  if (!profile) {
    return res
      .status(401)
      .json({ message: `profile id ${req.params.profileId} does not exist` });
  }

  const publishedGame = await Game.find({ profile: req.params.profileId });

  if (publishedGame.length > 1) {
    return res
      .status(401)
      .send({ message: "Maximum 2 games allowed for each profile" });
  }
  const game = await Game.create(req.body);

  res.status(200).json({
    success: true,
    data: game,
  });
});

// @desc      update Game
// @route     PUT /api/v1/games/:id
// @access    Private

exports.updateGame = asyncHandler(async (req, res, next) => {
  let game = await Game.findById(req.params.id);

  // const profile = await Profile.findById(game.profile.toString());

  // //checking wether game belongs to correct profile
  // if (game.profile.toString() !== profile.id.toString()) {
  //   return res.status(401).send({
  //     message: "This game does not belongs to this user ",
  //   });
  // }

  game = await Game.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!game) {
    res.status(401).json({ message: "Game not found" });
  }

  res.status(200).json({
    success: true,
    data: game,
  });
});

// delete game
exports.deleteGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findByIdAndDelete(req.params.id);

  if (!game) {
    res.status(401).json({ message: "Game not found" });
  }

  res.status(200).json({
    success: true,
    data: game,
  });
});
