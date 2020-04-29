const express = require("express"),
  router = express.Router(),
  fs = require("fs"),
  Mixes = require("../models/mixes");

const OktaJwtVerifier = require("@okta/jwt-verifier");
const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`
});

const multer = require("multer");
const uuid = require("uuid");

const audioStorage = multer.diskStorage({
  destination: "./public/audio",
  filename: function(req, file, callback) {
    Mixes.findOne({
      userId: req.body.userId
    }).then(mix => {
      if (mix) {
        return callback(new Error());
      } else {
        callback(null, uuid() + file.originalname);
      }
    });
  }
});

const multerUpload = multer({
  storage: audioStorage
}).single("fileName");

router.use(async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Authorization header is required");
    }

    const accessToken = req.headers.authorization.trim().split(" ")[1];
    await oktaJwtVerifier.verifyAccessToken(accessToken, "api://default");
    next();
  } catch (error) {
    // next(error.message);
    res.redirect("/");
  }
});

// *******  INDEX ******** //
router.get("/", async (req, res) => {
  try {
    const data = await Mixes.find({});

    const currentUserTrack = data.find(obj => {
      return String(res.locals.userID) === String(obj.userId);
    });
    const filteredData = data.filter(obj => {
      return String(obj.userId) !== String(res.locals.userID);
    });
    currentUserTrack
      ? (orderedData = [currentUserTrack, ...filteredData])
      : (orderedData = data);

    res.json({ data: orderedData });
  } catch (e) {
    console.log(e);
  }
});

// *******  SHOW ******** //
router.get("/:id", async (req, res) => {
  try {
    const data = await Mixes.findById(req.params.id);
    res.json({ data, currentLoggedInUser: res.locals.userID });
  } catch (e) {
    res.send("404, temporary, fix this");
  }
});

// *******  CREATE ******** //
router.post("/", async (req, res) => {
  multerUpload(req, res, err => {
    if (err) {
      res.status(403).json({
        message: "sorry, you must wait 24 hours to upload another track"
      });
    } else {
      Mixes.find({ userId: req.body.userId }, (err, data) => {
        if (data.length > 0) {
          res.status(403).json({
            message: "sorry, you must wait 24 hours to upload another track"
          });
        } else {
          const returnedTarget = Object.assign(
            { notes: req.sanitize(req.body.notes) },
            { fileName: req.file.filename, userId: req.body.userId },
            { createdAt: new Date() }
          );
          Mixes.create(returnedTarget, (err, data) => {
            if (err) console.error(err);
          });
        }
      });
    }
  });
});

// *******  EDIT TRACK UPLOAD ******** //
router.put("/:id/edit", async (req, res) => {
  try {
    Mixes.findByIdAndUpdate(
      req.params.id,
      {
        notes: req.body.notes
      },
      { new: true },
      (err, data) => {
        if (err) {
          console.log(err);
        }
      }
    );
    res.send("temporary, fix this");
  } catch (e) {
    console.log(e);
  }
});

// *******  DESTROY TRACK ******** //
router.delete("/:id", async (req, res) => {
  try {
    await Mixes.findByIdAndDelete(req.params.id);
    fs.unlink(`./public/audio/${req.body.fileName}`, (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
