
const Subject = require("../models/Subject");
const User = require("../models/User");


exports.getSubjects = async(req, res, next) => {
  try{
 await Subject.find({}, (err, subject) => {
    if (err) next(err);
    res.render("Subject/subjects", { subject });
  });
}
catch(err){
  next(err)
}
};

exports.getFormAddSubject = (req, res) => {
  res.render("Subject/new");
};

exports.addSubjectHandler = async(req, res, next) => {
  try{
  const { subjectname } = req.body;

  let errors = [];
  if (!subjectname) {
    errors.push({ msg: "Please fill up" });
  }
  if (errors.length > 0) {
    res.render("Subject/new", { subjectname, errors });
  } else {
   await Subject.findOne({ subjectname }, async(err, samesubject) => {
      if (err) throw new Error(err);
      if (samesubject) {
        errors.push({ msg: "subjectname already exist" });
        res.render("Subject/new", { subjectname, errors });
      } else {
        let newSubject = new Subject({ subjectname });
      await  newSubject.save((err, saved) => {
          req.flash("success_msg", `${subjectname} has been created`);
          res.redirect("/subjects");
        });
      }
    });
  }
}catch(err){
  next(err)
}
};

exports.delete = async (req, res, next) => {
  try{
  await Subject.findByIdAndRemove(req.params.id, (err, deleted) => {
    if (err) {
      req.flash("error_msg", err);
      res.redirect("/subjects");
    } else {
      req.flash("success_msg", ` deleted`);
      res.redirect("/subjects");
    }
  });
}catch(err){
  next(err)
}
};

exports.getTestPage = async (req, res,next) => {
  try {
    await Subject.findById(req.params.id, async (err, subject) => {
      res.render("Subject/test", { subject });
    });
  } catch (err) {
    next(err)
  }
};

exports.addSubjectForStudentHandler = async (req, res, next) => {
  try{
  await User.findOne({ name: req.user.name }, async(err, user) => {
    if (err) {
      throw err;
    } else {
    await  Subject.findById(req.params.id, async(err, fsubject) => {
        if (err) {
          throw err;
        } else {
          if (user.subject_list.length == 4) {
            req.flash("error_msg", "You can only register four (4) Subjects");
            res.redirect("/subjects");
          } else {
            user.subject_list.push(fsubject);
            // user.score.push(fsubject)
          await  user.save((err, data) => {
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
}catch(err){
  next(err)
}
};
exports.deleteSubjectForStudentHandler = async (req, res,next) => {
  try{
  await User.findOneAndUpdate(
    { name: req.user.name },
    { $pull: { subject_list: req.params.id } },
    async(err, user) => {
      if (err) {
        throw err;
      } else {
      await  Subject.findById(req.params.id, (err, fsubject) => {
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
  }catch(err){
    next(err)
  }
};

exports.recordScoreHandler = async(req, res, next) => {
  try{
await  User.findOne({ name: req.user.name },async (err, user) => {
   await Subject.findById(req.params.id, (err, subject) => {
      req.flash("success_msg", `you score is ${req.params.score}`);
      res.redirect("/dashboard");
    });
  });
}catch(err){
  next(err)
}
};
