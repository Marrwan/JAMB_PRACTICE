var express = require("express");
const user = require("../controllers/users");

var router = express.Router();

// SIGUP ROUTE
router
  .route("/signup")
  //  GET-ROUTE : Get form to sigup .
  .get(user.getSignupForm)
  // CREAT-ROUTE:  signup handle
  .post(user.signupHandler);

// LOGIN ROUTE
router
  .route("/login")
  // CREATE-ROUTE handle login
  .post(user.login);

module.exports = router;
