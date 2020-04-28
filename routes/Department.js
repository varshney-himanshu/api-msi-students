const router = require("express").Router();
const passport = require("passport");

//models
const Department = require("../models/Department");
const Semester = require("../models/Semester");

//config
const roles = require("../config/Roles");

// @route   POST department/add
// @desc    add new department
// @access  private (ADMIN access only)
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.admin) {
      return res.status(403).json({ error: "access denied" });
    }

    const { title } = req.body;
    if (title === undefined) {
      return res.status(400).json({ title: "title required" });
    }
    const data = {
      title,
    };

    const newDepartment = new Department(data);
    newDepartment
      .save()
      .then((department) => {
        if (department) {
          res.status(200).json({ department });
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route   DELETE department/:id
// @desc    delete a department
// @access  private (ADMIN access only)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;

    if (req.user.role !== roles.admin) {
      return res.status(403).json({ error: "access denied" });
    }

    Department.findOneAndDelete({ _id: id })
      .then((department) => {
        if (department) {
          res.status(200).json(department);
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route   GET department/all
// @desc    get all departments
// @access  public
router.get("/all", (req, res) => {
  Department.find().then((departments) => {
    res.status(200).json(departments);
  });
});

// @route   GET department/:id/semesters
// @desc    get all the semester of a department by id
// @access  public
router.get("/:id/semesters", (req, res) => {
  const { id } = req.params;
  // console.log(id);

  Semester.find({ "department.department_id": id })
    .then((sems) => {
      if (sems) {
        res.status(200).json(sems);
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
