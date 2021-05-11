var mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  state: {
    type: String,
  },
  school: {
    type: String,
  },
  password: {
    type: String,
  },
  userType: {
    type: String,
    enum: ["admin", "student"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  email: {
    type: String,
  },
  subject_list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
