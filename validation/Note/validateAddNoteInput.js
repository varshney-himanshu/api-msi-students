const Validator = require("validator");
const isEmpty = require("../../utils/IsEmpty");

module.exports = function validateAddNoteInput(data) {
  let errors = {};

  data.department_id = !isEmpty(data.department_id) ? data.department_id : "";
  data.department_name = !isEmpty(data.department_name)
    ? data.department_name
    : "";
  data.subject_id = !isEmpty(data.subject_id) ? data.subject_id : "";
  data.subject_name = !isEmpty(data.subject_name) ? data.subject_name : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.user_name = !isEmpty(data.user_name) ? data.user_name : "";
  data.user_id = !isEmpty(data.user_id) ? data.user_id : "";
  data.semester_id = !isEmpty(data.semester_id) ? data.semester_id : "";
  data.semester_name = !isEmpty(data.semester_name) ? data.semester_name : "";

  if (!Validator.isLength(data.title, { min: 2, max: 30 })) {
    errors.title = "title must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "title field is required";
  }

  if (Validator.isEmpty(data.department_id)) {
    errors.department_id = "department_id field is required";
  }

  if (Validator.isEmpty(data.department_name)) {
    errors.department_name = "department_name field is required";
  }

  if (Validator.isEmpty(data.subject_id)) {
    errors.subject_id = "subject_id field is required";
  }

  if (Validator.isEmpty(data.subject_name)) {
    errors.subject_name = "subject_name field is required";
  }

  if (Validator.isEmpty(data.user_name)) {
    errors.user_name = "user_name field is required";
  }

  if (Validator.isEmpty(data.user_id)) {
    errors.user_id = "user_id field is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "description field is required";
  }

  if (Validator.isEmpty(data.semester_id)) {
    errors.semester_id = "semester_id field is required";
  }

  if (Validator.isEmpty(data.semester_name)) {
    errors.semester_name = "semester_name field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
