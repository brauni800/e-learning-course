'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { validateProfessor } = require('../../../middlewares');
const {
  createLesson,
  deleteLesson,
  getLesson,
  getResults,
} = require('../controller');
const {
  paramCreateLesson,
  paramDeleteLesson,
  paramGetLesson,
  paramGetResults,
} = require('../params');

router.post('/', reqValidator(paramCreateLesson), validateProfessor, (req, res) => {
  createLesson(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

router.delete('/', reqValidator(paramDeleteLesson), validateProfessor, (req, res) => {
  deleteLesson(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

router.get('/', reqValidator(paramGetLesson), (req, res) => {
  getLesson(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

router.get('/:lessonId/results', reqValidator(paramGetResults), (req, res) => {
  getResults(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
