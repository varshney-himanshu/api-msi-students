const Validator = require("validator");
const isEmpty = require("../utils/IsEmpty");

module.exports = function validateEventRegisterInput(data) {
  //console.log(data);
  let errors = {};

  data.creator_id = !isEmpty(data.creator_id) ? data.creator_id : "";
  data.creator_name = !isEmpty(data.creator_name) ? data.creator_name : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.deadline = !isEmpty(data.deadline) ? data.deadline : "";
  data.venue = !isEmpty(data.venue) ? data.venue : "";
  data.date = !isEmpty(data.date) ? data.date : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.members = !isEmpty(data.members) ? data.members : "";

  if (Validator.isEmpty(data.creator_id)) {
    errors.creator_id = "creator_id is required";
  }

  if (Validator.isEmpty(data.creator_name)) {
    errors.creator_name = "creator_name is required";
  }

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
  if (Validator.isEmpty(data.type)) {
    errors.type = "type is required";
  }

  if (Validator.isEmpty(data.members)) {
    errors.members = "member field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
