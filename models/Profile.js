const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProfileSchema = new schema(
  {
    user: {
      type: schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    enrollment_id: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    department: {
      department_name: {
        type: String,
        required: true,
      },
      department_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Department",
      },
    },
    semester: {
      semester_name: {
        type: String,
        required: true,
      },
      semester_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Semester",
      },
    },
    section: {
      type: String,
      required: true,
    },
    institute: {
      type: String,
      required: true,
    },
    registered: [{ type: schema.Types.ObjectId }],
  },
  { timestamps: true }
);

module.exports = Profile = mongoose.model("Profile", ProfileSchema);
