'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { NotFoundError } = require('objection');
const { validateRole } = require('../../../middlewares');
const {
  createQuestions,
  deleteQuestions,
  getQuestions,
  replyQuestion,
} = require('../controller');
const {
  paramCreateQuestion,
  paramDeleteQuestion,
  paramGetQuestion,
  paramReplyQuestion,
} = require('../params');

router.post('/', reqValidator(paramCreateQuestion), validateRole('professor'), (req, res) => {
  createQuestions(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.delete('/', reqValidator(paramDeleteQuestion), validateRole('professor'), (req, res) => {
  deleteQuestions(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.get('/', reqValidator(paramGetQuestion), (req, res) => {
  getQuestions(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.post('/reply', reqValidator(paramReplyQuestion), (req, res) => {
  replyQuestion(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
