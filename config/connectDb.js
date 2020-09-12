const mongoose = require("mongoose");

const mongoDb = async () => {
  const connect = await mongoose.connect(
    "mongodb+srv://Sandipan:123@cluster0-l29kl.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    }
  );
};

module.exports = mongoDb;
