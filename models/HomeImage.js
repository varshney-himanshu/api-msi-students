const mongoose = require("mongoose");
const schema = mongoose.Schema;

const HomeImageSchema = new schema(
  {
    event: {
      event_id: { type: schema.Types.ObjectId },
      event_msg: { type: String },
    },

    image: {
      image_url: { type: String, required: true },
      image_type: { type: String, required: true },
      s3_key: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = HomeImage = mongoose.model("homeimages", HomeImageSchema);
