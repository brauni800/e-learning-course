'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { signup, signin } = require('../controller');
const { paramSignup, paramProfessor, paramSignin } = require('../params');
const { validateToken, validateRole } = require('../../../middlewares');
const { NotFoundError } = require('objection');

router.post('/signup', reqValidator(paramSignup), (req, res) => {
  signup(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.post('/professor', validateToken, reqValidator(paramProfessor), validateRole('admin'), (req, res) => {
  signup(req.dto, 'professor')
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.post('/signin', reqValidator(paramSignin), (req, res) => {
  signin(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
