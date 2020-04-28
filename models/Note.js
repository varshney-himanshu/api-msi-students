const mongoose = require("mongoose");
const schema = mongoose.Schema;

const noteSchema = new schema(
  {
    title: {
      type: String,
      required: true,
    },

    user: {
      user_name: {
        type: String,
        required: true,
      },
      user_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },

    subject: {
      subject_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Subject",
      },
      subject_name: {
        type: String,
        required: true,
      },
    },

    semester: {
      semester_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Semester",
      },
      semester_name: { type: String, required: true },
    },

    department: {
      department_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Department",
      },
      department_name: { type: String, required: true },
    },

    description: {
      type: String,
      required: true,
    },

    file: {
      file_type: {
        type: String,
        default: "",
        //figure out  its requirement
      },
      file_url: {
        type: String,
        required: true,
      },
      s3_key: {
        type: String,
        required: true,
      },
    },

    approved: {
      isApproved: {
        type: Boolean,
        default: false,
      },
      approvedBy: {
        name: { type: String },
        id: { type: schema.Types.ObjectId },
      },
    },
  },

  { timestamps: true }
);

module.exports = Note = mongoose.model("Note", noteSchema);
