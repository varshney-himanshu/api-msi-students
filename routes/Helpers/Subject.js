const Subject = require("../../models/Subject");

const IncreaseNoteCount = (subject_id, callback = () => {}) => {
  Subject.findOne({ _id: subject_id }).then((subject) => {
    const previousCount = subject.notesCount;
    Subject.findOneAndUpdate(
      { _id: subject_id },
      { notesCount: previousCount + 1 },
      { new: true }
    )
      .then((subject) => {
        if (subject) {
          callback();
        }
      })
      .catch((err) => console.log(err));
  });
};

const DecreaseNoteCount = (subject_id, callback = () => {}) => {
  Subject.findOne({ _id: subject_id }).then((subject) => {
    const previousCount = subject.notesCount;
    Subject.findOneAndUpdate(
      { _id: subject_id },
      { notesCount: previousCount - 1 },
      { new: true }
    )
      .then((subject) => {
        callback();
      })
      .catch((err) => console.log(err));
  });
};

module.exports = {
  IncreaseNoteCount,
  DecreaseNoteCount,
};
