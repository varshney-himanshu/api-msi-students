const Validator = require("validator");
const isEmpty = require("../utils/IsEmpty");

module.exports = function validateProfileRegisterInput(data) {
  //console.log(data);
  let errors = {};

  data.user = !isEmpty(data.user) ? data.user : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.enrollment_id = !isEmpty(data.enrollment_id) ? data.enrollment_id : "";
  data.institute = !isEmpty(data.institute) ? data.institute : "";

  data.fullName = !isEmpty(data.fullName) ? data.fullName : "";
  data.section = !isEmpty(data.section) ? data.section : "";
  data.department_name = !isEmpty(data.department_name)
    ? data.department_name
    : "";
  data.department_id = !isEmpty(data.department_id) ? data.department_id : "";
  data.semester_name = !isEmpty(data.semester_name) ? data.semester_name : "";
  data.semester_id = !isEmpty(data.semester_id) ? data.semester_id : "";

  if (Validator.isEmpty(data.user)) {
    errors.user = "user is required";
  }

  if (Validator.isEmpty(data.enrollment_id)) {
    errors.enrollment_id = "enrollment_id is required";
  }

  if (Validator.isEmpty(data.department_id)) {
    errors.department_id = "department_id is required";
  }

  if (Validator.isEmpty(data.department_name)) {
    errors.department_name = "department_name is required";
  }

  if (Validator.isEmpty(data.institute)) {
    errors.institute = "institute is required";
  }

  if (Validator.isEmpty(data.semester_id)) {
    errors.semester_id = "semester_id is required";
  }

  if (Validator.isEmpty(data.semester_name)) {
    errors.semester_name = "semester_name is required";
  }

  if (Validator.isEmpty(data.section)) {
    errors.section = "section is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "email is required";
  }

  if (Validator.isEmpty(data.fullName)) {
    errors.fullName = "Full name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
