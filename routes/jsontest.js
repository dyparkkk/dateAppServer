const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.send('hello test');
    console.log(req.session);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
