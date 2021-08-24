const express = require('express');
const router = express.Router();

// @route   POST api/posts
// @desc    Register user
// @access  Public
router.post('/', (req, res) => {
  res.send('Posts route');
});

module.exports = router;
