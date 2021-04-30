const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.json({ 
      user: 'dypark',
      position: 'back-end dev'});
    console.log(req.session);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
