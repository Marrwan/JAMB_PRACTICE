var mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    user: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique:true
    },
  subject: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      unique:true
    },
    score: {
        type: Number
      }
});

module.exports = mongoose.model("Score", scoreSchema);
