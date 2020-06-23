const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/connectDb");

// connect mongoDb
connectDb();

//env files path
dotenv.config({ path: "./config/config.env" });

//routes import
const userProfileRoute = require("./routes/profile");
const game = require("./routes/game");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const review = require("./routes/review");

const app = express();

//Body parser
app.use(express.json());

// app.use(multer);
app.use(express.static("tmp/my-uploads"));

//routes
app.use("/api/v1/profile", userProfileRoute);
app.use("/api/v1/games", game);
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/review", review);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server is running in ${process.env.NODE_ENV} on PORT ${PORT}`)
);

//handle unhandled rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`);
  server.close(1);
});
