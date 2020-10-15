'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { createQuestions, deleteQuestions, getQuestions } = require('../controller');
const { paramCreateQuestion, paramDeleteQuestion, paramGetQuestion } = require('../params');
const { validateProfessor } = require('../../../middlewares');

router.post('/', reqValidator(paramCreateQuestion), validateProfessor, (req, res) => {
  createQuestions(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

router.delete('/', reqValidator(paramDeleteQuestion), validateProfessor, (req, res) => {
  deleteQuestions(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});
router.get('/', reqValidator(paramGetQuestion), (req, res) => {
  getQuestions(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
