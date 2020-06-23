const jwt = require("jsonwebtoken");
const User = require("../model/user");
const asyncHandler = require("./asynchandler");
exports.protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Please login first" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET, function (
      err,
      decoded
    ) {
      if (err) {
        return 0;
      } else {
        return decoded;
      }
    });

    if (!decode) {
      return res.status(401).json({ message: "Please login first" });
    }

    console.log("decode", decode.id);
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } else {
    return await res.status(401).json({
      message: "Please login first",
    });
  }
});

exports.authorize = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    console.log("req.users", req.user);
    if (!roles.includes(req.user.role)) {
      return res
        .status(200)
        .json({ message: `User is not autorized to access data` });
    }
    next();
  };
};
