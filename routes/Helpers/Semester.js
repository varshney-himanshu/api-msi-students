const Semester = require("../../models/Semester");

const IncreaseSubjectCount = (semester_id) => {
  Semester.findOne({ _id: semester_id }).then((semester) => {
    const previousCount = semester.subjectCount;
    Semester.findOneAndUpdate(
      { _id: semester_id },
      { subjectCount: previousCount + 1 },
      { new: true }
    ).catch((err) => console.log(err));
  });
};

const DecreaseSubjectCount = (semester_id) => {
  Semester.findOne({ _id: semester_id }).then((semester) => {
    const previousCount = semester.subjectCount;
    Semester.findOneAndUpdate(
      { _id: semester_id },
      { subjectCount: previousCount - 1 },
      { new: true }
    ).catch((err) => console.log(err));
  });
};

module.exports = {
  IncreaseSubjectCount,
  DecreaseSubjectCount,
};
