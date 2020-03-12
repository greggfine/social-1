const express = require("express"),
  router = express.Router(),
  objID = require("../dbConnect").objectID,
  Mixes = require("../models/mixes");

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
