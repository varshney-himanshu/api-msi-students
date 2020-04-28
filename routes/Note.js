const router = require("express").Router();
const multer = require("multer");
const keys = require("../config/keys");
const passport = require("passport");
const roles = require("../config/Roles");

//utils
const replaceSpaces = require("../utils/ReplaceSpaces");
const { IncreaseNoteCount, DecreaseNoteCount } = require("./Helpers/Subject");
//models
const Note = require("../models/Note");
const Subject = require("../models/Subject");

//initializing s3 bucket
const s3Bucket = require("../S3")();

//multer config
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

const validateAddNoteInput = require("../validation/Note/validateAddNoteInput");

// @route   POST /note/add
// @desc    Add a new note
// @access  private
router.post(
  "/add",
  [passport.authenticate("jwt", { session: false }), upload.single("file")],
  (req, res) => {
    if (req.file === undefined) {
      return res.status(400).json({ file: "file is required!" });
    }

    const { errors, isValid } = validateAddNoteInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const file = req.file;
    const s3FileURL = keys.awsUploadedFileUrl;

    const {
      user_name,
      user_id,
      department_id,
      department_name,
      subject_id,
      subject_name,
      description,
      title,
      semester_id,
      semester_name,
    } = req.body;

    let params = {
      Bucket: keys.awsBucketName,
      Body: file.buffer,
      Key: "files/" + replaceSpaces(file.originalname),
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    s3Bucket.upload(params, (err, data) => {
      if (err) {
        res.status(500).json({ err: true, Message: err });
      } else {
        let newNote = new Note({
          title,
          description,
          department: {
            department_id,
            department_name,
          },
          subject: { subject_id, subject_name },
          semester: { semester_id, semester_name },
          user: {
            user_name,
            user_id,
          },
          file: {
            file_type: file.mimetype,
            file_url: s3FileURL + params.Key,
            s3_key: params.Key,
          },
        });

        newNote.save((err, note) => {
          if (err) {
            console.log(err);
          } else {
            //response if success
            res.status(200).json({ success: true, data: note });
          }
        });
      }
    });
  }
);

// @route   GET note/all
// @desc    get all notes, approved or unapproved
// @access  private [ADMIN]
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.admin) {
      const errors = { auth: "not authorized!" };
      return res.status(403).json(errors);
    }
    Note.find().then((notes) => {
      res.status(200).json(notes);
    });
  }
);

// @route   PUT note/:id/approve
// @desc    approve note
// @access  private [Moderator]
router.put(
  "/:id/approve",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.admin && req.user.role !== roles.mod) {
      const errors = { auth: "not authorized!" };
      return res.status(403).json(errors);
    }
    const { user_id, user_name } = req.body;

    if (user_id === undefined || user_name === undefined) {
      return res.status(400).json({ err: "userid or username missing!" });
    }

    const id = req.params.id;
    const data = {
      approved: {
        isApproved: true,
        approvedBy: { name: user_name, id: user_id },
      },
    };
    Note.findOneAndUpdate({ _id: id }, data, { new: true })
      .then((note) => {
        if (note) {
          IncreaseNoteCount(note.subject.subject_id);
          res.status(200).json(note);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

// @route   DELETE note/:id
// @desc    Delete note
// @access  private [ADMIN]
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.admin) {
      const errors = { auth: "not authorized!" };
      return res.status(403).json(errors);
    }

    const id = req.params.id;
    // console.log(id);

    Note.findOneAndDelete({ _id: id })
      .then((note) => {
        if (note) {
          let s3Params = {
            Bucket: keys.awsBucketName,
            Key: note.file.s3_key,
          };
          s3Bucket.deleteObject(s3Params, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              if (note.approved.isApproved) {
                DecreaseNoteCount(note.subject.subject_id);
              }
              res.status(200).json(note);
            }
          });
        }
      })
      .catch((err) => console.log(err));
  }
);

/* #subject routes */

// @route   GET note/subject/:id
// @desc    get all approved notes with subject id
// @access  public
router.get("/subject/:id/approved", (req, res) => {
  const { id } = req.params;
  Note.find({
    "subject.subject_id": id,
    "approved.isApproved": true,
  })
    .then((notes) => {
      if (notes) {
        res.status(200).json(notes);
      } else {
        res.status(404).json({ error: "no notes found" });
      }
    })
    .catch((err) => console.log(err));
});

// @route   GET note/subject/:id/unapproved
// @desc    get all unapproved notes with subject id
// @access  public
router.get("/subject/:id/unapproved", (req, res) => {
  const { id } = req.params;
  Note.find({
    "subject.subject_id": id,
    "approved.isApproved": false,
  })
    .then((notes) => {
      if (notes) {
        res.status(200).json(notes);
      } else {
        res.status(404).json({ error: "no notes found" });
      }
    })
    .catch((err) => console.log(err));
});

// @route   GET note/subject/:id/all
// @desc    get all notes with subject id
// @access  public
router.get("/subject/:id/all", (req, res) => {
  const { id } = req.params;
  Note.find({ "subject.subject_id": id })
    .then((notes) => {
      if (notes) {
        res.status(200).json(notes);
      } else {
        res.status(404).json({ error: "no notes found" });
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
