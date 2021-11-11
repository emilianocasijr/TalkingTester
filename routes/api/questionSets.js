const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const QuestionSet = require('../../models/QuestionSet');

// @route   GET api/questionSets/mine
// @desc    Test route
// @access  Private
// @return  *Returns empty json if no question set found
router.get('/mine', auth, async (req, res) => {
  try {
    const questionSets = await QuestionSet.find({ user: req.user.id });
    return res.json(questionSets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/questionSets/
// @desc    Create current user's question sets
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
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

    const { title, questions } = req.body;

    // Build question set
    const questionSetFields = {};
    questionSetFields.user = req.user.id;
    questionSetFields.title = title;
    questionSetFields.questions = questions;
    questionSetFields.questionSetID = uuidv4();

    try {
      let questionSetNew = new QuestionSet(questionSetFields);
      await questionSetNew.save();
      return res.json(questionSetNew);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/questionSets/title
// @desc    Update current user's question sets
// @access  Private
router.put(
  '/title',
  [
    auth,
    [
      check('questionSetID', 'Question Set ID required').not().isEmpty(),
      check('title', 'Title required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, questionSetID } = req.body;

    try {
      let questionSetNew = await QuestionSet.findOne({
        questionSetID: questionSetID,
      });
      // Update if question set already exists
      if (questionSetNew) {
        questionSetNew = await QuestionSet.findOneAndUpdate(
          { questionSetID: questionSetID },
          { title: title },
          { new: true }
        );
        return res.json(questionSetNew);
        // If does not exist return error
      } else {
        return res
          .status(400)
          .send(
            'Question ID does not exist. Please use POST method for creating new question sets.'
          );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/questionSets/
// @desc    Update current user's question sets but will delete all
// @access  Private
router.put(
  '/',
  [auth, [check('questionSetID', 'Question Set ID required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, questions, questionSetID } = req.body;

    // Build question set
    const questionSetFields = {};
    questionSetFields.user = req.user.id;
    if (title) {
      questionSetFields.title = title;
    }
    if (questions) {
      questionSetFields.questions = questions;
    }

    try {
      let questionSetNew = await QuestionSet.findOne({
        questionSetID: questionSetID,
      });
      // Update if question set already exists
      if (questionSetNew) {
        questionSetNew = await QuestionSet.findOneAndUpdate(
          { questionSetID: questionSetID },
          { $set: questionSetFields },
          { new: true }
        );
        return res.json(questionSetNew);
        // If does not exist return error
      } else {
        return res
          .status(400)
          .send(
            'Question ID does not exist. Please use POST method for creating new question sets.'
          );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/question-sets/:question_set_id
// @desc    Get question set with passed ID
// @access  Private
router.get('/:question_set_id', async (req, res) => {
  try {
    const questionSet = await QuestionSet.findOne({
      questionSetID: req.params.question_set_id,
    });
    if (!questionSet) {
      return res.status(400).json({ msg: 'Question Set not found' });
    }
    res.json(questionSet);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Question Set not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/questionSets/
// @desc    Delete the question set with the passed ID
// @access  Private
router.delete('/', auth, async (req, res) => {
  const { questionSetID } = req.body;
  try {
    const questionSet = await QuestionSet.findById(questionSetID);
    if (!questionSet) {
      return res.status(400).json({ msg: 'Question Set not found' });
    } else {
      await QuestionSet.findByIdAndRemove(questionSetID);
      return res.json({ msg: 'Question Set deleted' });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Question Set not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
