'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { signup } = require('../controller');
const { paramSignup } = require('../params');

router.post('/signup', reqValidator(paramSignup), (req, res) => {
  signup(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
