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
const eventRoute = require("./routes/Event");
const profileRoute = require("./routes/Profile");
const imageRoute = require("./routes/Image");
const noticeRoute = require("./routes/Notice");
const semesterRoute = require("./routes/Semester");
const departmentRoute = require("./routes/Department");
const subjectRoute = require("./routes/Subject");

app.use("/user", userRoute);
app.use("/note", noteRoute);
app.use("/event", eventRoute);
app.use("/profile", profileRoute);
app.use("/image", imageRoute);
app.use("/notice", noticeRoute);
app.use("/semester", semesterRoute);
app.use("/department", departmentRoute);
app.use("/subject", subjectRoute);

//passport initialization
app.use(passport.initialize());
require("./config/passport")(passport);

//port settings
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
}
