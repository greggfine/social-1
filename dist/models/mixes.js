const mongoose = require("mongoose");

const MixesSchema = new mongoose.Schema(
  {
    fileName: String,
    notes: String,
    userId: String,
    comments: Array,
    createdAt: Date
  }
  //   { timestamps: true }
);

MixesSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Mixes", MixesSchema);
