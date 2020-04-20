const router = require("express").Router();
const passport = require("passport");

//helpers
const {
  IncreaseSemesterCount,
  DecreaseSemesterCount,
} = require("./Helpers/Department");
//models
const Subject = require("../models/Subject");
const Semester = require("../models/Semester");

//config
const roles = require("../config/Roles");

// @route   POST semester/add
// @desc    add new semester to a department
// @access  private (SUPERADMIN access only)
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.superadmin) {
      return res.status(403).json({ error: "access denied" });
    }

    const { department_id, department_name, title } = req.body;
    const data = {
      title,
      department: {
        department_id,
        department_name,
      },
    };

    const newSemester = new Semester(data);

    newSemester
      .save()
      .then((semester) => {
        if (semester) {
          IncreaseSemesterCount(department_id);
          res.status(200).json({ semester });
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route   DELETE semester/:id
// @desc    delete a semester
// @access  private (SUPERADMIN access only)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;

    if (req.user.role !== roles.superadmin) {
      return res.status(403).json({ error: "access denied" });
    }

    Semester.findOneAndDelete({ _id: id })
      .then((sem) => {
        if (sem) {
          DecreaseSemesterCount(sem.department.department_id);
          res.status(200).json(sem);
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route   GET semester/:id/subjects
// @desc    get all the subjects of a semester id
// @access  public
router.get("/:id/subjects", (req, res) => {
  const { id } = req.params;

  Subject.find({ "semester.semester_id": id })
    .then((subjects) => {
      if (subjects) {
        res.status(200).json(subjects);
      } else {
        res.status(404).json({ error: "no notes found" });
      }
    })
    .catch((err) => console.log(err));
});

// @route   GET semester/all
// @desc    get all semesters in the database
// @access  public
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Semester.find()
      .then((semesters) => {
        if (semesters) {
          res.status(200).json(semesters);
        }
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
