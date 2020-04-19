const router = require("express").Router();
const Event = require("../models/Event");
const passport = require("passport");
const mongoose = require("mongoose");
const multer = require("multer");
const keys = require("../config/keys");
const { Parser } = require("json2csv");
const s3Bucket = require("../S3")();
const roles = require("../config/Roles");
const replaceSpaces = require("../utils/ReplaceSpaces");

let storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const validateEventRegisterInput = require("../validation/event-registration");

// @route   POST /event/register
// @desc    add new event
// @access  private
router.post(
  "/register",
  [passport.authenticate("jwt", { session: false }), upload.single("file")],
  (req, res) => {
    // if (req.user.role !== roles.admin && req.user.role !== roles.superadmin) {
    //   return res.status(401).json({ msg: "unauthorized" });
    // }

    const { isValid, errors } = validateEventRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (req.file === undefined) {
      return res.status(400).json({ file: "file is required!" });
    }

    const file = req.file;
    const s3FileURL = keys.awsUploadedFileUrl;

    //s3 bucket params
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

    const {
      creator_name,
      creator_id,
      venue,
      description,
      title,
      deadline,
      date,
      type,
      members,
    } = req.body;

    let event = {
      creator: { creator_name, creator_id },
      venue,
      description,
      title,
      image,
      deadline,
      date,
      type,
    };

    if (type === "MULTIPLE") {
      event.members = members;
    }

    s3Bucket.upload(params, (err, data) => {
      if (err) {
        res.status(500).json({ err: true, Message: err });
      } else {
        const newEvent = new Event(event);

        newEvent
          .save()
          .then((event) => {
            if (event) {
              res.status(200).json(event);
            }
          })
          .catch((err) => res.status(400).json(err));
      }
    });
  }
);

// @route   GET /event/all
// @desc    get all events
// @access  public
router.get("/all", (req, res) => {
  Event.find()
    .sort({ createdAt: -1 })
    .then((events) => {
      res.status(200).json(events);
    });
});

// @route   GET /event/user/all
// @desc    get user's all event data
// @access  private
router.get(
  "/user/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.user;

    Event.find({ creator: id })
      .sort({ createdAt: -1 })
      .then((events) => {
        if (events) {
          res.status(200).json(events);
        }
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route   GET /event/:id
// @desc    get event by id
// @access  public
router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  Event.findOne({ _id: id })
    .then((event) => {
      if (event) {
        res.status(200).json(event);
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// @route   PUT /event/:id
// @desc    Update event by id
// @access  private
router.put(
  "/:id",
  [passport.authenticate("jwt", { session: false }), upload.single("file")],
  (req, res) => {
    const { isValid, errors } = validateEventRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { venue, description, title, deadline, date, image_prev } = req.body;

    let updatedata = {};
    updatedata.venue = venue;
    updatedata.description = description;
    updatedata.title = title;
    updatedata.deadline = deadline;
    updatedata.date = date;

    if (req.file) {
      const file = req.file;
      const s3FileURL = keys.awsUploadedFileUrl;

      //s3 bucket params
      let params = {
        Bucket: keys.awsBucketName,
        Body: file.buffer,
        Key: "images/" + replaceSpaces(file.originalname),
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      const image = {
        image_url: s3FileURL + params.keys,
        image_type: file.mimetype,
        s3_key: params.keys,
      };

      updatedata.image = image;
      const prevImage = JSON.parse(image_prev);

      //delete parameters
      const dParams = {
        Bucket: keys.awsBucketName,
        Key: prevImage.s3_key,
      };
      s3Bucket.deleteObject(dParams, (err, data) => {
        if (err) console.log(err);
      });
    }

    const { id } = req.params;

    Event.findOneAndUpdate({ _id: id }, updatedata, {
      new: true,
    })
      .then((event) => {
        if (event) {
          res.status(200).json(event);
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
);

// @route   POST /event/:id/register-user
// @desc    register user in an event by event_id
// @access  private
router.post(
  "/:id/register-user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    Event.findOneAndUpdate(
      { _id: id },
      { $push: { usersRegistered: user } },
      { new: true }
    )
      .then((event) => {
        if (event) {
          res.status(200).json(event);
        }
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route   PUT /event/:id
// @desc    Update event by id
// @access  private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id } = req.params;
    const user = req.user.id;
    Event.findOneAndDelete({ _id: id })
      .then((event) => {
        if (event) {
          const dParams = {
            Bucket: keys.awsBucketName,
            Key: event.image.s3_key,
          };
          s3Bucket.deleteObject(dParams, (err, data) => {
            if (err) console.log(err);
            else res.status(200).json(event);
          });
        }
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route   POST /event/ids
// @desc    get all events with array of ids
// @access  private
router.post(
  "/ids",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { registered } = req.body;
    const ObjectId = mongoose.Types.ObjectId;
    const objIds = registered.map((id) => (id = new ObjectId(id)));

    Event.find({
      _id: {
        $in: objIds,
      },
    })
      .then((events) => {
        if (events) {
          res.status(200).send(events);
        }
      })
      .catch((err) => {
        res.status(400);
      });
  }
);

/* code this endpoint better. Only ask for event id */

// @route   POST /event/download-teams-registered
// @desc    download event register data
// @access  private
router.post(
  "/download-teams-registered",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { registerData, members, type } = req.body;
    let fields = [];

    if (type === "MULTIPLE") {
      fields.push("teamName");
      for (let i = 1; i <= Number(members); i++) {
        fields.push(`Member_${i}_Name`);
        fields.push(`Member_${i}_Email`);
        fields.push(`Member_${i}_E_ID`);
        fields.push(`Member_${i}_Phone`);
        fields.push(`Member_${i}_Institute`);
        fields.push(`Member_${i}_Course`);
      }
    } else {
      fields = [
        "fullName",
        "email",
        "phone",
        "enrollment_id",
        "institute",
        "course",
      ];
    }

    const opts = {
      fields,
      excelStrings: false,
    };

    const parser = new Parser(opts);
    const csv = parser.parse(registerData);
    console.log(csv);

    res.attachment("registered.csv");

    res.status(200).send(csv);
  }
);

module.exports = router;
