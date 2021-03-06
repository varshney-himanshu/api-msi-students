const Validator = require("validator");
const isEmpty = require("../../utils/IsEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.role = !isEmpty(data.role) ? data.role : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.department_id = !isEmpty(data.department_id) ? data.department_id : "";
  data.department_name = !isEmpty(data.department_name)
    ? data.department_name
    : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  if (Validator.isEmpty(data.role)) {
    errors.role = "Role is required";
  }

  if (Validator.isEmpty(data.department_id)) {
    errors.department_id = "Department id is required";
  }

  if (Validator.isEmpty(data.department_name)) {
    errors.department_name = "Department name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
