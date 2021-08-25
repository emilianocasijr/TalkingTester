const mongoose = require('mongoose');

const QuestionSetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  questionSetID: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      choices: [
        {
          choice: {
            type: String,
            required: true,
          },
          answer: {
            type: Boolean,
            default: false,
          },
        },
      ],
      data: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          answerData: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = QuestionSet = mongoose.model('questionSet', QuestionSetSchema);
