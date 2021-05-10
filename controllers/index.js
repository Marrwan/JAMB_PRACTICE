const axios = require("axios");
// LOAD MODELS


const Subject = require("../models/Subject");
const User = require("../models/User");
const AppError = require("../utilities/appError");

exports.getHomepage = async (req, res) => {
  try {
    // await MSSNNews.find({}, async (err, mssnnews) => {
    //   await AcademicNews.find({}, async (err, academicnews) => {
    //     await ScholarshipNews.find({}, async (err, scholarshipnews) => {
          const response = await axios.get("https://type.fit/api/quotes");
          const random = Math.floor(Math.random() * response.data.length);
          const data = response.data[random];
     
          await User.find({},async(err,users)=>{
           await Subject.find({},(err,subjects)=>{

          res.render("index", {users,subjects,data});
           })
          })
    //     }).sort({ created: "desc" });
    //   }).sort({ created: "desc" });
    // }).sort({ created: "desc" });
  } catch (err) {
    return new AppError(err.message, err.status);
  }
};

exports.getDashboard = async (req, res) => {
  await User.find({}, (err, users) => {
    User.findOne({name:req.user.name}).populate("subject_list").exec((err,user)=>{

    res.render("dashboard", { users,user });
    })
  });
};

exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
};

exports.back  = (req,res) => {
  res.redirect('back')
}
