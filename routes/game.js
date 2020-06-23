const express = require("express");

const Game = require("../model/game");
const {
  createGame,
  getGames,
  getGame,
  updateGame,
  deleteGame,
} = require("../controller/game");
const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route("/")
  .get(advancedResult(Game), authorize("admin"), getGames)
  .post(createGame);
router.route("/:id").get(getGame).put(updateGame).delete(deleteGame);

module.exports = router;
