const router = require("express").Router();
const HomeImage = require("../models/HomeImage");
const multer = require("multer");
const passport = require("passport");
const roles = require("../config/Roles");

const keys = require("../config/keys");
const s3Bucket = require("../S3")();
const replaceSpaces = require("../utils/ReplaceSpaces");

let storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   POST /image/home/add
// @desc    Add new home image
// @access  private (SUPERADMIN access only)
router.post(
  "/home/add",
  [passport.authenticate("jwt", { session: false }), upload.single("file")],
  (req, res) => {
    if (req.user.role !== roles.admin) {
      return res.status(401).json({ msg: "unauthorized" });
    }

    if (req.file === undefined) {
      return res.status(400).json({ file: "file is required!" });
    }

    const file = req.file;
    const s3FileURL = keys.awsUploadedFileUrl;

    let params = {
      Bucket: keys.awsBucketName,
      Body: file.buffer,
      Key: "images/" + replaceSpaces(file.originalname),
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const image = {
      image_url: s3FileURL + params.Key,
      image_type: file.mimetype,
      s3_key: params.Key,
    };
    const event = JSON.parse(req.body.event);
    const newImage = new HomeImage({
      image,
      event,
    });

    s3Bucket.upload(params, (err, data) => {
      if (err) {
        res.status(500).json({ err: true, Message: err });
      } else {
        newImage
          .save()
          .then((image) => {
            if (image) {
              res.status(200).json({ success: true });
            }
          })
          .catch((err) => res.status(400).json(err));
      }
    });
  }
);

// @route   GET /image/home
// @desc   Get all home images
// @access  private
router.get("/home", (req, res) => {
  HomeImage.find()
    .sort({ createdAt: -1 })
    .then((images) => {
      if (images) {
        res.status(200).json(images);
      }
    })
    .catch((err) => res.status(400).json(err));
});

// @route   DELETE /image/home/:id
// @desc   delete home images
// @access  private (SUPERADMIN access only)
router.delete(
  "/home/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== roles.admin) {
      return res.status(401).json({ msg: "unauthorized" });
    }

    const id = req.params.id;

    HomeImage.findOneAndDelete({ _id: id })
      .then((image) => {
        if (image) {
          //s3 delete parameters
          const params = {
            Key: image.image.s3_key,
            Bucket: keys.awsBucketName,
          };

          s3Bucket.deleteObject(params, (err, data) => {
            if (err) console.log(err);
            res.status(200).json({ sucess: true, data: image });
          });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

module.exports = router;
