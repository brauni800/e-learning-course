'use strict';

const { Lesson } = require('../../../models');

const createLesson = ({ courseId, lessons }) => new Promise((resolve, reject) => {
  Lesson.createLessons(courseId, lessons)
      .then(() => resolve({ status: 200, data: { message: 'Ok' } }))
      .catch((err) => reject(err));
});

const deleteLesson = ({ lessonId, correlative }) => new Promise((resolve, reject) => {
  Lesson.deleteLessons(lessonId, correlative)
      .then(() => resolve({ status: 200, data: { message: 'Ok' } }))
      .catch((err) => reject(err));
});

const getLesson = () => new Promise((resolve, reject) => {});

module.exports = {
  createLesson,
  deleteLesson,
  getLesson,
};
