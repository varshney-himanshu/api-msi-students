const mongoose = require("mongoose");
const schema = mongoose.Schema;

const eventSchema = new schema(
  {
    creator: {
      creator_name: {
        type: String,
        required: true,
      },
      creator_id: {
        type: schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    },
    image: {
      image_url: { type: String },
      image_type: { type: String },
      s3_key: { type: String },
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    usersRegistered: {
      type: Array,
    },
    members: {
      type: Number,
    },
    approved: {
      isApproved: {
        type: Boolean,
        default: false,
      },
      approvedBy: {
        id: { type: schema.Types.ObjectId, default: null },
        name: { type: String, default: "" },
      },
    },
  },
  { timestamps: true }
);

module.exports = Event = mongoose.model("events", eventSchema);
