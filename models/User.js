const mongoose = require("mongoose");
const schema = mongoose.Schema;
const roles = require("../config/Roles");
const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: [roles.admin, roles.mod, roles.student],
    },
    department: {
      type: String,
      required: true,
    },
    isProfileCreated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", userSchema);
