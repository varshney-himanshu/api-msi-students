const express = require("express");
const passport = require("passport");
const Database = require("./Database");
const app = (module.exports = express());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//db connection
const db = new Database();
db.start();

//routes config
const userRoute = require("./routes/User");
const noteRoute = require("./routes/Note");

app.use("/user", userRoute);
app.use("/note", noteRoute);

//passport initialization
app.use(passport.initialize());
require("./config/passport")(passport);

//port settings
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
}
