const mongoose = require("mongoose");
const schema = mongoose.Schema;

const departmentSchema = new schema(
  {
    //semester title
    title: {
      type: String,
      required: true,
    },
    semesterCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = Notice = mongoose.model("departments", departmentSchema);
