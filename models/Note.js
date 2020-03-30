const mongoose = require("mongoose");
const schema = mongoose.Schema;

const noteSchema = new schema(
  {
    title: {
      type: String,
      required: true
    },
    user: {
      name: {
        type: String,
        required: true
      },
      id: {
        type: schema.Types.ObjectId,
        required: true
      }
    },
    subject: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    file: {
      file_type: {
        type: String,
        default: ""
        //figure out  its requirement
      },
      file_url: {
        type: String,
        required: true
      },
      s3_key: {
        type: String,
        required: true
      }
    }
  },

  { timestamps: true }
);

module.exports = Note = mongoose.model("notes", noteSchema);
