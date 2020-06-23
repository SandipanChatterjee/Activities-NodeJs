const asyncHandler = require("../middleware/asynchandler");
const User = require("../model/user");
const sendEmail = require("../utils/sendemail");
const crypto = require("crypto");

// @desc      Register
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  sendResponseToken(user, 200, res);
});

// @desc      Login
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "Please enter email and password" });
  }
  // find user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }
  //check for correct password
  const checkPassword = await user.checkPassword(password);

  if (!checkPassword) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  sendResponseToken(user, 200, res);
});

// @desc      Forgot Password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  const resetToken = user.getResetPasswordToken();

  // LOOK INTO IT
  // user
  //   .save({ validateBeforeSave: false })
  //   .then((val) => console.log("val", val))
  //   .catch((err) => console.log("err1", err));

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: email,
      subject: "Password reset",
      message,
    });

    res.status(200).send({
      message: "email sent",
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc      Reset Password
// @route     POST /api/v1/auth/resetpassword
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  console.log("resetPasswordToken1", resetPasswordToken);
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  console.log("user::::::::::::", user);

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  const result = await user.save();

  const message = "password reset successfull";

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset",
      message,
    });

    res.status(200).send({
      message: "Check your email",
      result,
    });
  } catch (err) {
    console.log(err);
  }
});

function sendResponseToken(user, status, res) {
  const token = user.getToken();

  res.status(status).json({
    success: true,
    data: user,
    token,
  });
}
