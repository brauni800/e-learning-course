'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const { createCourse, deleteCourse, getCourse } = require('../controller');
const { paramCreateCourse, paramDeleteCourse } = require('../params');
const { validateRole } = require('../../../middlewares');

router.post('/', reqValidator(paramCreateCourse), validateRole('professor'), (req, res) => {
  createCourse(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

router.delete('/', reqValidator(paramDeleteCourse), validateRole('professor'), (req, res) => {
  deleteCourse(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

router.get('/', (req, res) => {
  getCourse()
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
