const mongoose = require("mongoose");
const schema = mongoose.Schema;

const semesterSchema = new schema(
  {
    //semester title
    title: {
      type: String,
      required: true,
    },

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

    subjectCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = Semester = mongoose.model("semesters", semesterSchema);
