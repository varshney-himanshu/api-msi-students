const router = require("express").Router();
const passport = require("passport");
//helpers
const {
  IncreaseSubjectCount,
  DecreaseSubjectCount,
} = require("./Helpers/Semester");

//model
const Subject = require("../models/Subject");

//config
const roles = require("../config/Roles");

// @route   POST /subject/add
// @desc    add a subject
// @access  private (SUPERADMIN access only)
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.superadmin) {
      return res.status(403).json({ error: "access denied" });
    }

    const {
      department_id,
      department_name,
      semester_id,
      semester_name,
      title,
    } = req.body;

    const data = {
      title,
      semester: { semester_id, semester_name },
      department: {
        department_id,
        department_name,
      },
    };

    const newSubject = new Subject(data);

    newSubject
      .save()
      .then((subject) => {
        if (subject) {
          IncreaseSubjectCount(subject.semester.semester_id);
          res.status(200).json({ subject });
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route   DELETE subject/:id
// @desc    delete a subject
// @access  private (SUPERADMIN access only)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;

    if (req.user.role !== roles.superadmin) {
      return res.status(403).json({ error: "access denied" });
    }

    Subject.findOneAndDelete({ _id: id })
      .then((sub) => {
        if (sub) {
          DecreaseSubjectCount(sub.semester.semester_id);
          res.status(200).json(sub);
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route   GET /subject/all
// @desc    get all subjects
// @access  public
router.get("/all", (req, res) => {
  Subject.find()
    .sort({ $natural: -1 })
    .then((subjects) => {
      if (subjects) {
        res.status(200).json(subjects);
      }
    })
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
