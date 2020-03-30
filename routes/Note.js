const router = require("express").Router();
const multer = require("multer");
const keys = require("../config/keys");
let AWS = require("aws-sdk");
const Note = require("../models/Note");

let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

const validateAddNoteInput = require("../validation/Note/validateAddNoteInput");

router.post("/add", upload.single("file"), (req, res) => {
  if (req.file === undefined) {
    return res.status(400).json({ file: "file is required!" });
  }

  const { errors, isValid } = validateAddNoteInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const file = req.file;
  const s3FileURL = keys.awsUploadedFileUrl;

  let s3Bucket = new AWS.S3({
    accessKeyId: keys.awsAccessKeyID,
    secretAccessKey: keys.awsSecretAccessKey,
    region: keys.awsRegion
  });

  const {
    user_name,
    user_id,
    department,
    subject,
    description,
    title
  } = req.body;

  let params = {
    Bucket: keys.awsBucketName,
    Body: file.buffer,
    Key: file.originalname,
    ContentType: file.mimetype,
    ACL: "public-read"
  };

  s3Bucket.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({ err: true, Message: err });
    } else {
      let newNote = new Note({
        title,
        description,
        department,
        subject,
        user: {
          name: user_name,
          id: user_id
        },
        file: {
          file_type: file.mimetype,
          file_url: s3FileURL + file.originalname,
          s3_key: params.Key
        }
      });

      newNote.save((err, note) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({ success: true, data: note });
        }
      });
    }
  });
});

module.exports = router;
