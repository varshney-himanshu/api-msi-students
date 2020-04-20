const Validator = require("validator");
const isEmpty = require("../utils/IsEmpty");

module.exports = function validateEventUpdateInput(data) {
  //console.log(data);
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.deadline = !isEmpty(data.deadline) ? data.deadline : "";
  data.venue = !isEmpty(data.venue) ? data.venue : "";
  data.date = !isEmpty(data.date) ? data.date : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "title is required";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "description is required";
  }
  if (Validator.isEmpty(data.venue)) {
    errors.venue = "venue is required";
  }
  if (Validator.isEmpty(data.deadline)) {
    errors.deadline = "deadline is required";
  }
  if (Validator.isEmpty(data.date)) {
    errors.date = "date is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
