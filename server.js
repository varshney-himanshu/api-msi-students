const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const app = (module.exports = express());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//db connection
const keys = require("./config/keys");
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  err => {
    if (err) {
      console.log(err);
    } else {
      //   console.log("Database connected!");
    }
  }
);

//routes config
const userRoute = require("./routes/User");

app.use("/user", userRoute);

//passport initialization
app.use(passport.initialize());
require("./config/passport")(passport);

//port settings
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
}
