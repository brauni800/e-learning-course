'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { createCourse } = require('../controller');
const { paramCreateCourse } = require('../params');
const { validateProfessor } = require('../../../middlewares');

router.post('/', reqValidator(paramCreateCourse), validateProfessor, (req, res) => {
  createCourse(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
