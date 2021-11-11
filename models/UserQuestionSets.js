const mongoose = require('mongoose');

const UserQuestionSetsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  questionSetID: {
    type: String,
  },
  userQuestionSetID: {
    type: String,
  },
  data: [
    {
      questionID: {
        // Use id created by mongoDB, if modified then ignore because data would be invalid
        type: String,
        required: true,
      },
      answerData: {
        type: Array,
        default: [], // Just add 0 (zero) or 1 (one) depending on incorrect or correct answer respectively. This is to allow filtering based on last 'x' attemps.
      },
    },
  ],
  dateModified: {
    type: Date,
    default: Date.now,
  },
});

module.exports = UserQuestionSets = mongoose.model(
  'userQuestionSets',
  UserQuestionSetsSchema
);
