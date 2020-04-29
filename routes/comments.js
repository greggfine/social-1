const express = require("express"),
  router = express.Router(),
  objID = require("../dbConnect").objectID,
  Mixes = require("../models/mixes");

const OktaJwtVerifier = require("@okta/jwt-verifier");
const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`
});

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

router.post("/:id", async (req, res) => {
  try {
    await Mixes.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            comment: (req.body.comment = req.sanitize(req.body.comment)),
            commentCreatorID: res.locals.userID,
            id: objID.ObjectId()
          }
        }
      },
      { new: true, upsert: true }
    );
    res.redirect(`/tracks/${req.params.id}`);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
