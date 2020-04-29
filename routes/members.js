const express = require("express"),
  router = express.Router(),
  fs = require("fs"),
  Members = require("../models/members");
const multer = require("multer");

const OktaJwtVerifier = require("@okta/jwt-verifier");
const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`
});

const uuid = require("uuid");
const imageStorage = multer.diskStorage({
  destination: "./public/imgs",
  filename: function(req, file, callback) {
    Members.findOne({
      _id: req.body._id
    }).then(member => {
      fs.unlink(`./public/imgs/${member.fileName}`, (err, result) => {
        if (err) {
          console.log(err);
        }
      });
    });
    callback(null, uuid() + file.originalname);
  }
});

const multerUpload = multer({
  storage: imageStorage
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

router.get("/", async (req, res) => {
  const data = await Members.find({});
  res.json({ data });
});

router.post("/", async (req, res) => {
  multerUpload(req, res, err => {
    let returnedTarget;
    if (req.file) {
      returnedTarget = Object.assign(
        {},
        { fileName: req.file.filename },
        req.body
      );
    } else {
      returnedTarget = Object.assign({}, req.body);
    }

    Members.findOne({
      userID: req.body.userID
    }).then(member => {
      if (member) {
        Members.updateOne(
          { userID: req.body.userID },
          returnedTarget,
          (err, result) => {
            if (err) {
              console.log(err);
            }
          }
        );
      } else {
        Members.create(returnedTarget, (err, data) => {
          if (err) console.error(err);
        });
      }
    });
  });
});

module.exports = router;
