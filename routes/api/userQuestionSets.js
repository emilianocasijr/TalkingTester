const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const UserQuestionSet = require('../../models/UserQuestionSets');

// @route   GET api/questionSets
// @desc    Get all user question sets of current user
// @access  Private
// @return  *Returns empty json if no question set found
router.get('/', auth, async (req, res) => {
  try {
    const userQuestionSets = await UserQuestionSets.find({ user: req.user.id });
    return res.json(userQuestionSets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/user-question-sets/
// @desc    Create current user's user question set
// @access  Private
router.post(
  '/',
  [
    auth,
    [check('questionSetID', 'Question set ID is required').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { data, questionSetID } = req.body;

    // Build question set
    const userQuestionSetFields = {};
    userQuestionSetFields.user = req.user.id;
    if (data) {
      userQuestionSetFields.data = data;
    }
    userQuestionSetFields.questionSetID = questionSetID;
    userQuestionSetFields.userQuestionSetID = uuidv4();

    try {
      let userQuestionSetNew = new UserQuestionSet(userQuestionSetFields);
      await userQuestionSetNew.save();
      return res.json(userQuestionSetNew);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/userQuestionSets/
// @desc    Update current user's question set data or create if it doesn't exist
// @access  Private
router.put(
  '/',
  [auth, [check('questionSetID', 'Question Set ID required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { data, questionSetID } = req.body;

    // Build question set
    const userQuestionSetFields = {};
    if (data) {
      console.log(data);
      userQuestionSetFields.data = data;
      userQuestionSetFields.dateModified = new Date();
    } else {
      // If no data received then reset data
      userQuestionSetFields.data = [];
    }

    try {
      let userQuestionSetNew = await UserQuestionSet.findOne({
        questionSetID: questionSetID,
        user: req.user.id,
      });
      // Update if question set exists
      if (userQuestionSetNew) {
        // If it exists then create
        console.log(userQuestionSetFields);
        try {
          userQuestionSetNew = await UserQuestionSet.findOneAndUpdate(
            { userQuestionSetID: userQuestionSetNew.userQuestionSetID },
            { $set: userQuestionSetFields },
            { new: true }
          ).then((res) => {
            console.log('successfully updated');
            console.log(res);
          });
          return res.json(userQuestionSetNew);
        } catch (error) {
          console.log(error);
        }

        // If does not exist then create one
      } else {
        console.log('user question set does not exist');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/userQuestionSets/:user_question_set_id
// @desc    Get user question set with passed ID
// @access  Private
router.get('/:questionSetID', auth, async (req, res) => {
  try {
    const userQuestionSet = await UserQuestionSet.findOne({
      questionSetID: req.params.questionSetID,
      user: req.user.id,
    });
    if (!userQuestionSet) {
      return res.status(400).json({ msg: 'Question Set not found' });
    } else if (userQuestionSet.user != req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User does not own this user question set' });
    }
    res.json(userQuestionSet);
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
  const { userQuestionSetID } = req.body;
  try {
    const userQuestionSet = await UserQuestionSet.findById(userQuestionSetID);
    if (!userQuestionSet) {
      return res.status(400).json({ msg: 'Question Set not found' });
    } else {
      if (userQuestionSet.user != req.user.id) {
        return res
          .status(401)
          .json({ msg: 'User does not own this user question set' });
      }
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
