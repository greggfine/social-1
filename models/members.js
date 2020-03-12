const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  email: String,
  fileName: String,
  userID: String,
  memberName: String,
  instrument1: String,
  instrument2: String,
  instrument3: String,
  genre1: String,
  genre2: String,
  genre3: String,
  location: String,
  socialMedia1: String,
  socialMedia2: String,
  socialMedia3: String,
  website: String,
  phone: String
});

const Members = mongoose.model("Members", MemberSchema);
// Members.create({
//   memberName: "gregg fine",
//   instrument: "guitar",
//   genre: "blues",
//   location: "miami"
// });

// Members.deleteOne({ memberName: "a" }).then(result => console.log(result));

module.exports = mongoose.model("Members", MemberSchema);
