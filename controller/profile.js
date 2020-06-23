const Profile = require("../model/profile");
const User = require("../model/user");
const asyncHandler = require("../middleware/asynchandler");

//@desc       GET All UserProfile
// @route     GET /api/v1/profiles
// @access    Public
exports.getUsersProfile = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc      Get Single UserProfile
// @route     GET /api/v1/profile/:id
// @access    Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: profile,
  });
  // next();
});

// @desc      Create UserProfile
// @route     POST /api/v1/profile
// @access    Private
exports.createUserProfile = asyncHandler(async (req, res, next) => {
  console.log("req.user.id", req.user.id);

  req.body.user = req.user.id;

  const publishedProfile = await Profile.find({ user: req.user.id });

  console.log("publishedProfile:::::::::::::", publishedProfile);

  //each user except admin will be allowed to create only 1 profile
  if (req.user.role !== "admin" && publishedProfile.length > 0) {
    return res.status(401).json({
      message: "This user has already created a profile",
    });
  }
  const profile = await Profile.create(req.body);
  res.status(200).json({
    success: true,
    data: profile,
  });
  // next();
});

// @desc      Update UserProfile
// @route     PUT /api/v1/profile/:id
// @access    Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: profile,
  });
  // next();
});

// @desc      Delete UserProfile
// @route     DELETE /api/v1/profile/:id
// @access    Private
exports.deleteUserProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findByIdAndRemove(req.params.id);
  res.status(200).json({
    success: true,
    data: profile,
  });
  // next();
});

// @desc      uploadImage
// @route     PUT /api/v1/profile/:id/uploadimage
// @access    Private

exports.uploadImage = asyncHandler(async (req, res, next) => {
  console.log(req.file);
  req.file.filename = req.file.originalname;
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return res.status(200).json({
      message: `Profile not found`,
    });
  }

  if (!req.file || !req.file.mimetype.startsWith("image")) {
    return res.status(200).json({
      message: `Please upload image`,
    });
  }
  //stroing image inside profileschema
  const filePath = req.file.path.split("\\").join("/");
  await profile.storeImage(filePath);
  profile.save();
  res.status(401).json({
    data: req.file,
  });
});
