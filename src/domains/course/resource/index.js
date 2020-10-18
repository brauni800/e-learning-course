'use strict';

const router = require('express').Router();
const { reqValidator } = require('@brauni/req-validator');
const {
  createCourse,
  deleteCourse,
  getCourse,
  joinCourse,
  getAvailableLessons,
  getStatus,
} = require('../controller');
const { paramCreateCourse, paramDeleteCourse, paramJoinCourse } = require('../params');
const { validateRole } = require('../../../middlewares');
const { NotFoundError } = require('objection');

router.post('/', reqValidator(paramCreateCourse), validateRole('professor'), (req, res) => {
  createCourse(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.delete('/', reqValidator(paramDeleteCourse), validateRole('professor'), (req, res) => {
  deleteCourse(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.get('/', (req, res) => {
  getCourse()
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.post('/:courseId/join', reqValidator(paramJoinCourse), validateRole('student'), (req, res) => {
  joinCourse(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.get('/:courseId/available', reqValidator(paramJoinCourse), (req, res) => {
  getAvailableLessons(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

router.get('/:courseId/status', reqValidator(paramJoinCourse), (req, res) => {
  getStatus(req.dto)
      .then(({ status, data }) => res.status(status).json(data))
      .catch((err) => {
        console.error(err.stack);
        if (err instanceof NotFoundError) return res.status(err.data.status).json({ message: err.data.message });
        else return res.status(400).json({ message: err.message });
      });
});

module.exports = router;
