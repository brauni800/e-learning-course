'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { createQuestions } = require('../controller');
const { paramCreateQuestion } = require('../params');
const { validateProfessor } = require('../../../middlewares');

router.post('/', reqValidator(paramCreateQuestion), validateProfessor, (req, res) => {
  createQuestions(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
