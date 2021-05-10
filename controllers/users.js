const bcrypt = require("bcryptjs");
const passport = require("passport");


// LOAD MODELS
const User = require("../models/User");

exports.getSignupForm = (req, res) => {
  res.render("signup");
};
exports.signupHandler = (req, res, next) => {
 
  const {
    name,
    username,
    school,
    state,
    email,
    password,
    confirm,
    gender,
    userType,
  } = req.body;

  let errors = [];

  if (
    !name ||
    !username ||
    !email ||
    !state ||
    !school ||
    !password ||
    !confirm ||
    !userType ||
    !gender
  ) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password.length <= 5) {
    errors.push({ msg: "Password must be greater than five characters" });
  }

  if (password != confirm) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("signup", {
      errors,
      email,
      name,
      state,
      school,
      username,
      password,
      confirm,
      userType,
      gender,
    });

    // res.redirect('back')
  } else {
    User.findOne({ email: email }).then((founduser) => {
      errors.push({ msg: "A user with that email already exist" });
      if (founduser) {
        res.render("signup", {
          errors,
          email,
          name,
          school,
          state,
          username,
          password,
          confirm,
          userType,
          gender,
        });
      } else {
        const newUser = new User({
          email,
          name,
          password,
          state,
          school,
          username,
          userType,
          gender,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hashed) => {
            newUser.password = hashed;
            newUser
              .save()
              .then((user) => {
                console.log(user);
                req.flash(
                  "success_msg",
                  "Congrats! You are now a registered member"
                );
                passport.authenticate("local", {
                  successRedirect: "/dashboard",
                  failureRedirect: "/login",
                  failureFlash: true,
                })(req, res, next);
              })
              .catch((err) => {
                throw err;
              });
          });
        });
      }
    });
  }
};
exports.login = (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "back",
      failureRedirect: "back",
      failureFlash: true,
    })(req, res, next);
  }