const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
// const mongoURI = "mongodb://localhost:27017/fcc-mix-app";

module.exports = {
  connect: mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  }),
  objectID: mongoose.Types
};
