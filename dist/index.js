const express = require("express"),
  app = express(),
  path = require("path"),
  helmet = require("helmet"),
  objID = require("./dbConnect").objectID,
  Mixes = require("./models/mixes"),
  http = require("http"),
  methodOverride = require("method-override"),
  tracksRouter = require("./routes/tracks"),
  commentsRouter = require("./routes/comments"),
  membersRouter = require("./routes/members"),
  socket = require("socket.io"),
  expressSanitizer = require("express-sanitizer"),
  cors = require("cors"),
  OktaJwtVerifier = require("@okta/jwt-verifier");

// const oktaJwtVerifier = new OktaJwtVerifier({
//   clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
//   issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`
// });

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = socket(server);
server.listen(PORT, () => console.log(`App is running on Port ${PORT}`));

app.use(helmet());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

io.on("connect", socket => {
  socket.on(
    "postComment",
    async (currentComment, currentTrack, currentUserID) => {
      try {
        const foundTrack = await Mixes.findById(currentTrack._id);
        if (foundTrack) {
          await Mixes.findByIdAndUpdate(
            currentTrack._id,
            {
              $push: {
                comments: {
                  comment: currentComment,
                  commentCreatorID: currentUserID,
                  id: objID.ObjectId()
                }
              }
            },
            { new: true, upsert: true }
          );
          await io.emit("updateDOM");
        } else {
          socket.emit("trackDeletedRedirect");
        }
      } catch (e) {
        console.log(e);
      }
    }
  );
  socket.on("deleteComment", async (currentTrack, commentID) => {
    try {
      const foundTrack = await Mixes.findById(currentTrack._id);
      if (foundTrack) {
        await Mixes.updateOne(
          { _id: currentTrack },
          { $pull: { comments: { id: objID.ObjectId(commentID) } } }
        );
        await io.emit("updateDOM");
      } else {
        socket.emit("trackDeletedRedirect");
      }
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("editComment", async (commentID, editedComment, currentTrack) => {
    try {
      const foundTrack = await Mixes.findById(currentTrack._id);

      if (foundTrack) {
        await Mixes.updateOne(
          { "comments.id": objID.ObjectId(commentID) },
          { $set: { "comments.$.comment": editedComment } }
        );
        await io.emit("updateDOM");
      } else {
        socket.emit("trackDeletedRedirect");
      }
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("updateTrackCount", () => {
    io.emit("updateCurrNumTracks");
  });
});

// SHOULD THIS BE RE-ORDERED????
// app.use(async (req, res, next) => {
//   try {
//     if (!req.headers.authorization)
//       throw new Error("Authorization header is required");

//     const accessToken = req.headers.authorization.trim().split(" ")[1];
//     await oktaJwtVerifier.verifyAccessToken(accessToken, "api://default");
//     next();
//   } catch (error) {
//     next(error.message);
//   }
// });

app.use("/api/tracks", tracksRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/members", membersRouter);

if (process.env.NODE_ENV === "production") {
  // If we're in PRODUCTION, EXPRESS should serve up PRODUCTION ASSETS(like main.js or main.css)
  app.use(express.static("client/build"));
  //  EXPRESS should serve up index.html file if it doesn't recognize the route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
