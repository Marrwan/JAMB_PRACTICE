const express = require("express");
const { isLoggedIn, isAdmin } = require("../auth/auth");
const subject = require("../controllers/subject");

var router = express.Router();
// GET : get all subjects
router.get("/", subject.getSubjects);

// GET : get from to add subject
router.get("/new", isLoggedIn, isAdmin, subject.getFormAddSubject);
// CREATE  : Create subject handler
router.post("/new", isLoggedIn, isAdmin, subject.addSubjectHandler);

router.delete("/:id", isLoggedIn, isAdmin, subject.delete);

router.get('/:id/take-test',isLoggedIn,  subject.getTestPage)

router.post('/:id/add', isLoggedIn,  subject.addSubjectForStudentHandler)
router.post('/:id/unadd', isLoggedIn,  subject.deleteSubjectForStudentHandler)
router.post('/:id/score/:score', isLoggedIn,  subject.recordScoreHandler)

module.exports = router;
