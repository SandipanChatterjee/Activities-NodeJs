const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/users");
const advancedResults = require("../middleware/advancedResult");
const User = require("../model/user");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("admin"));
router.route("/allusers").get(advancedResults(User), getAllUsers);
router.route("/:id").get(getUser).post(updateUser).delete(deleteUser);

module.exports = router;
