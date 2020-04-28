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
        ref: "users",
      },
    },

    subject: {
      subject_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "subjects",
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
        ref: "semesters",
      },
      semester_name: { type: String, required: true },
    },

    department: {
      department_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "departments",
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
