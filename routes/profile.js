const {
  getUsersProfile,
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  uploadImage,
} = require("../controller/profile");
const express = require("express");
const router = express.Router();
const advancedResults = require("../middleware/advancedResult");
const Profile = require("../model/profile");
const game = require("./game");
const review = require("./review");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/uploadimage");
//redirect routes to other routes

router.use(protect);

router.use("/:profileId/games", game);
router.use("/:profileId/review", review);

router.route("/:id/uploadimage").put(upload.single("image"), uploadImage);

router
  .route("/")
  .get(advancedResults(Profile), authorize("admin"), getUsersProfile)
  .post(createUserProfile);

router
  .route("/:id")
  .get(getUserProfile)
  .put(updateUserProfile)
  .delete(deleteUserProfile);

module.exports = router;
