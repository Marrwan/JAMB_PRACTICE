const express = require("express");
const { isLoggedIn } = require("../auth/auth");
const index = require("../controllers");

var router = express.Router();

// GET-ROUTE : Get home page.
router.get("/", index.getHomepage);
//  GET-ROUTE : Dashboard
router.get("/dashboard", isLoggedIn, index.getDashboard);

//  GET-ROUTE : Logout user.
router.get("/logout", index.logout);

//  GET-ROUTE : Get about page.
router.get("/about", (req, res) => {
  res.render("about");
});
//  GET-ROUTE : Get about page.
router.get("/back", (req, res) => {
  res.redirect("..");
});
//  GET-ROUTE : Get admin signup page.
router.get("/admin", (req, res) => {
  res.render("adminsignup");
});

// facebook
router.get("/facebook", (req, res) => {
  res.redirect("https://facebook.com/devabdul1/");
});
// Twitter
router.get("/twitter", (req, res) => {
  res.redirect("https://twitter.com/dev__abdul");
});
// Instagram
router.get("/instagram", (req, res) => {
  res.redirect("https://www.instagram.com/abuabdurahmaan/");
});
// Whatsapp
router.get("/whatsapp", (req, res) => {
  res.redirect("https://wa.me/+2349064377766");
});
router.get('/back', index.back)
module.exports = router;
