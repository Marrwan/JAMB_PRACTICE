const axios = require("axios");
// LOAD MODELS

const Subject = require("../models/Subject");
const User = require("../models/User");


exports.getHomepage = async (req, res, next) => {
  try {
    const response = await axios.get("https://type.fit/api/quotes");
    const random = Math.floor(Math.random() * response.data.length);
    const data = response.data[random];

    await User.find({}, async (err, users) => {
      await Subject.find({}, (err, subjects) => {
        res.render("index", { users, subjects, data });
      });
    });
  } catch (err) {
    next(err)
  }
};

exports.getDashboard = async (req, res, next) => {
  try{
  await User.find({}, async(err, users) => {
   await User.findOne({ name: req.user.name })
      .populate("subject_list")
      .exec((err, user) => {
        res.render("dashboard", { users, user });
      });
  });
}catch(err){
  next(err)
}
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};

exports.back = (req, res) => {
  res.redirect("back");
};
