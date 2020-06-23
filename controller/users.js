const asyncHandler = require("../middleware/asynchandler");
const User = require("../model/user");

// @desc      Get all users
// @route     POST /api/v1/auth/users
// @access    Admin

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     POST /api/v1/auth/users/:id
// @access    Private/Admin

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      update user
// @route     POST /api/v1/auth/admin/:userid
// @access    Private/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      delete user
// @route     DELETE /api/v1/auth/admin/:id
// @access    Private/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});
