'use strict';

const { Lesson, Answer } = require('../../../models');

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

const getLesson = ({ courseId }) => new Promise((resolve, reject) => {
  Lesson.getLessons(courseId)
      .then((lessons) => {
        const result = lessons.reduce((accumulator, current) => {
          if (lessons.filter((l) => current.lesson_id === l.next_lesson).length === 0) {
            accumulator.lessons.push([current]);
          } else {
            accumulator.lessons.find((group) => group.find((l) => l.next_lesson === current.lesson_id)).push(current);
          }
          return accumulator;
        }, {
          courseId,
          lessons: [],
        });
        resolve({ status: 200, data: result });
      })
      .catch((err) => reject(err));
});

const getResults = ({ userId, lessonId }) => new Promise((resolve, reject) => {
  Answer.getResults(userId, lessonId)
      .then((answers) => answers.reduce((accumulator, current) => accumulator + Number(current.score), 0) / answers.length)
      .then((score) => Lesson.query().findById(lessonId).then((lesson) => ({ lesson, score })))
      .then(({ lesson, score }) => ({
        userId,
        approved: score >= Number(lesson.approval),
        score,
      }))
      .then((data) => resolve({ status: 200, data }))
      .catch((err) => reject(err));
});

module.exports = {
  createLesson,
  deleteLesson,
  getLesson,
  getResults,
};
