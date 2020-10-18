'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { NotFoundError } = require('objection');
const { validateRole } = require('../../../middlewares');
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

router.post('/', reqValidator(paramCreateLesson), validateRole('professor'), (req, res) => {
  createLesson(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.delete('/', reqValidator(paramDeleteLesson), validateRole('professor'), (req, res) => {
  deleteLesson(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.get('/', reqValidator(paramGetLesson), (req, res) => {
  getLesson(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.get('/:lessonId/results', reqValidator(paramGetResults), (req, res) => {
  getResults(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
