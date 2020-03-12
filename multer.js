const multer = require("multer");
const uuid = require("uuid");

const audioStorage = multer.diskStorage({
  destination: "./public/audio",
  filename: function(req, file, callback) {
    callback(null, uuid() + file.originalname);
  }
});

const audioUpload = multer({
  storage: audioStorage
}).single("fileName");

const imageStorage = multer.diskStorage({
  destination: "./public/imgs",
  filename: function(req, file, callback) {
    callback(null, uuid() + file.originalname);
  }
});

const imageUpload = multer({
  storage: imageStorage
}).single("fileName");

module.exports = { audioUpload, imageUpload };
