const router = require("express").Router();
const passport = require("passport");
const Notice = require("../models/Notice");

const roles = require("../config/Roles");

// @route   POST notice/add
// @desc    add notice
// @access  private [ADMIN]
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.superadmin) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    const { text } = req.body;

    const newNotice = new Notice({ text });
    newNotice
      .save()
      .then((notice) => {
        if (notice) {
          res.status(200).json(notice);
        }
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route   PUT notice/:id
// @desc    update notice
// @access  private [ADMIN]
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.superadmin) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    const { text } = req.body;
    const _id = req.params.id;

    Notice.findOneAndUpdate({ _id }, { text }, { new: true })
      .then((notice) => {
        if (notice) {
          res.status(200).json(notice);
        }
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route   PUT notice/latest
// @desc    approve event
// @access  public
router.get("/latest", (req, res) => {
  Notice.find()
    .limit(1)
    .sort({ $natural: -1 })
    .then((notices) => {
      if (notices) {
        res.status(200).json(notices[0]);
      }
    })
    .catch((err) => res.status(400).json(err));
});

// @route   GET /notice/all
// @desc    get all notice
// @access  private [SUPERADMIN]
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.superadmin) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    Notice.find()
      .sort({ $natural: -1 })
      .then((notices) => {
        if (notices) {
          res.status(200).json(notices);
        }
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route   DELETE /notice/:id
// @desc    delete notice
// @access  private [SUPERADMIN]
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.superadmin) {
      return res.status(401).json({ msg: "unauthorized" });
    }
    const id = req.params.id;

    Notice.findOneAndDelete({ _id: id })
      .then((notice) => {
        if (notice) {
          res.status(200).json(notice);
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

module.exports = router;
