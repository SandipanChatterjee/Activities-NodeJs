const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../model/review");
const {
  getAllReview,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controller/review");

const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router
  .route("/")
  .get(advancedResult(Review), authorize("admin"), getAllReview)
  .post(createReview);
router.route("/:id").get(getReview).put(updateReview).delete(deleteReview);

module.exports = router;
