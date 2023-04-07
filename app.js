require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const expressLayout = require("express-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require("method-override");

require("./config/passport")(passport);

const app = express();

//db
const db = process.env.mongoURI;
// const db = require("./config/config").mongoURI;
const AppError = require("./utilities/appError");
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("server connected"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Abdul",
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongoURL: process.env.mongoURI })
  })
);
app.use(flash())

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

// Message handler
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.User = req.user;
  res.locals.path = req.path;
  next();
});

app.use(require("./routes/index"));
app.use(require("./routes/users"));
app.use("/subjects", require("./routes/subject"));

// HANDLING UNHANDLED ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  const { status = 500, message = "Something went wrong!" } = err;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (status == 404) {
    res.render("error", { message, status });
  } else {
    res.status(status).send(message);
  }
  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});
module.exports = app;
