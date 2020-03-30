const Validator = require("validator");
const isEmpty = require("../../utils/IsEmpty");

module.exports = function validateAddNoteInput(data) {
  let errors = {};

  data.department = !isEmpty(data.department) ? data.department : "";
  data.subject = !isEmpty(data.subject) ? data.subject : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.user_name = !isEmpty(data.user_name) ? data.user_name : "";
  data.user_id = !isEmpty(data.user_id) ? data.user_id : "";

  if (!Validator.isLength(data.title, { min: 2, max: 30 })) {
    errors.title = "title must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "title field is required";
  }

  if (Validator.isEmpty(data.department)) {
    errors.department = "department field is required";
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = "subject field is required";
  }

  if (Validator.isEmpty(data.user_name)) {
    errors.user_name = "user_name field is required";
  }

  if (Validator.isEmpty(data.user_id)) {
    errors.user_id = "title field is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "description field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
