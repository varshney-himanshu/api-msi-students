const Department = require("../../models/Department");

const IncreaseSemesterCount = (department_id) => {
  Department.findOne({ _id: department_id }).then((department) => {
    const previousCount = department.semesterCount;
    Department.findOneAndUpdate(
      { _id: department_id },
      { semesterCount: previousCount + 1 },
      { new: true }
    ).catch((err) => console.log(err));
  });
};

const DecreaseSemesterCount = (department_id) => {
  Department.findOne({ _id: department_id }).then((department) => {
    const previousCount = department.semesterCount;
    Department.findOneAndUpdate(
      { _id: department_id },
      { semesterCount: previousCount - 1 },
      { new: true }
    ).catch((err) => console.log(err));
  });
};

module.exports = {
  IncreaseSemesterCount,
  DecreaseSemesterCount,
};
