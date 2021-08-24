const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const QuestionSet = require('../../models/QuestionSet');

// @route   GET api/questionSets/mine
// @desc    Test route
// @access  Public
// @return  *Returns empty json if no question set found
router.get('/mine', auth, async (req, res) => {
  try {
    const questionSet = await QuestionSet.find({ user: req.user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

  res.json(profile);
});

// @route   POST api/questionSets/
// @desc    Create or update current user's question sets
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('questions', 'At least one question is required').not().isEmpty(),
      check(
        'questions.*.choices',
        'At least one choice is required for each question'
      )
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questions, questionSetID } = req.body;

    // Build question set
    const questionSetFields = {};
    questionSetFields.user = req.user.id;
    if (questions) {
      questionSetFields.questions = questions;
    }
    if (questionSetID) {
      questionSetFields.questionSetID = questionSetID;
    }

    try {
      let questionSetNew = await QuestionSet.findById(questionSetID);
      // Overwrite if question set already exists
      if (questionSetNew) {
        questionSetNew = await QuestionSet.findOneAndUpdate(
          { user: req.user.id },
          { $set: questionSetFields },
          { new: true }
        );
        console.log('overwritten');
        return res.json(questionSetNew);
        // Else create new
      } else {
        questionSetNew = new QuestionSet(questionSetFields);
        await questionSetNew.save();
        console.log('added new');
        return res.json(questionSetNew);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
