'use strict';

const { Course } = require('../../../models');

const createCourse = ({ userId, courses }) => new Promise((resolve, reject) => {
  Course.createCourses(userId, courses)
      .then(() => resolve({ status: 200, data: { message: 'Ok' } }))
      .catch((err) => reject(err));
});

const deleteCourse = ({ courseId, correlative }) => new Promise((resolve, reject) => {
  Course.deleteCourses(courseId, correlative)
      .then(() => resolve({ status: 200, data: { message: 'Ok' } }))
      .catch((err) => reject(err));
});

module.exports = { createCourse, deleteCourse };
