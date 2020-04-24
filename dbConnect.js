const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;

module.exports = {
  connect: mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  }),
  objectID: mongoose.Types
};
