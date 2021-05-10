const axios = require("axios");
const Subject = require("../models/Subject");
const User = require("../models/User");
const Score = require("../models/Score");

exports.getSubjects = (req, res, next) => {
  Subject.find({}, (err, subject) => {
    if (err) next(err);
    res.render("Subject/subjects", { subject });
  });
};

exports.getFormAddSubject = (req, res) => {
  res.render("Subject/new");
  res.render("subject/new");
};

exports.addSubjectHandler = (req, res) => {
  const { subjectname } = req.body;

  let errors = [];
  if (!subjectname) {
    errors.push({ msg: "Please fill up" });
  }
  if (errors.length > 0) {
    res.render("Subject/new", { subjectname, errors });
  } else {
    Subject.findOne({ subjectname }, (err, samesubject) => {
      if (err) throw new Error(err);
      if (samesubject) {
        errors.push({ msg: "subjectname already exist" });
        res.render("Subject/new", { subjectname, errors });
      } else {
        let newSubject = new Subject({ subjectname });
        newSubject.save((err, saved) => {
          req.flash("success_msg", `${subjectname} has been created`);
          res.redirect("/subjects");
        });
      }
    });
  }
};

exports.delete = async (req, res) => {
  await Subject.findByIdAndRemove(req.params.id, (err, deleted) => {
    if (err) {
      res.redirect("/subjects");
      req.flash("error_msg", err);
    } else {
      req.flash("success_msg", ` deleted`);
      res.redirect("/subjects");
    }
  });
};

exports.getTestPage = async (req, res) => {
  try {
    await Subject.findById(req.params.id, async (err, subject) => {
      res.render("Subject/test", { subject });
    });
  } catch (err) {
    return new AppError(err.message, err.status);
  }
};

exports.addSubjectForStudentHandler = async (req, res) => {
  await User.findOne({ name: req.user.name }, (err, user) => {
    if (err) {
      throw err;
    } else {
      Subject.findById(req.params.id, (err, fsubject) => {
        if (err) {
          throw err;
        } else {
          if (user.subject_list.length == 4) {
            req.flash("error_msg", "You can only register four (4) Subjects");
            res.redirect("/subjects");
          } else {
            user.subject_list.push(fsubject);
            // user.score.push(fsubject)
            user.save((err, data) => {
              if (err) {
                throw err;
              } else {
                // console.log(data);
                req.flash(
                  "success_msg",
                  `${fsubject.subjectname} registered successfully, You can now go to your  dashboard and take your test`
                );
                res.redirect(`/subjects`);
              }
            });
          }
        }
      });
    }
  });
};
exports.deleteSubjectForStudentHandler = async (req, res) => {
  await User.findOneAndUpdate(
    { name: req.user.name },
    { $pull: { subject_list: req.params.id } },
    (err, user) => {
      if (err) {
        throw err;
      } else {
        Subject.findById(req.params.id, (err, fsubject) => {
          if (err) {
            throw err;
          } else {
            req.flash(
              "success_msg",
              `${fsubject.subjectname}  uregistered successfully`
            );
            res.redirect(`/subjects`);
          }
        });
      }
    }
  );
};

exports.recordScoreHandler = (req, res) => {
  User.findOne({ name: req.user.name }, (err, user) => {
    Subject.findById(req.params.id, (err, subject) => {
      req.flash("success_msg", `you score is ${req.params.score}`);
      res.redirect("/dashboard");
    });
  });
};
