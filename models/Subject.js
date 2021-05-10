var mongoose = require("mongoose");

module.exports = mongoose.model(
  "Subject",
  new mongoose.Schema({
    subjectname: {
      type: String,
      unique: true,
      required: true,
    },
  
  })
);
