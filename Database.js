const mongoose = require("mongoose");
const keys = require("./config/keys");

class Database {
  start() {
    mongoose.connect(
      keys.mongoURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      },
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Database Connected");
        }
      }
    );
  }

  close() {
    mongoose.disconnect();
  }
}

module.exports = Database;
