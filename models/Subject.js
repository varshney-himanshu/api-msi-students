const mongoose = require("mongoose");
const schema = mongoose.Schema;

const subjectSchema = new schema(
  {
    //subject title
    title: {
      type: String,
      required: true,
    },
    //department which the subject is associated
    department: {
      department_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "departments",
      },
      department_name: {
        type: String,
        required: true,
      },
    },
    //semester in which the subject is studied
    semester: {
      semester_id: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "semesters",
      },
      semester_name: {
        type: String,
        required: true,
      },
    },

    //number of approved and unapproved notes
    notesCount: {
      approved: {
        type: Number,
        default: 0,
      },
      unapproved: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = Notice = mongoose.model("subjects", subjectSchema);
