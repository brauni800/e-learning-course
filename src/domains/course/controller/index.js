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

/**
 * @returns {Promise<{status:Number,data:Course[]}>}
 */
const getCourse = () => new Promise((resolve, reject) => {
  Course.getCourses()
      .then((courses) => {
        const result = courses.reduce((/** @type {Course[][]} */accumulator, current) => {
          if (courses.filter((c) => current.course_id === c.next_course).length === 0) {
            accumulator.push([current]);
          } else {
            accumulator.find((group) => group.find((c) => c.next_course === current.course_id)).push(current);
          }
          return accumulator;
        }, []);
        return resolve({ status: 200, data: result });
      })
      .catch((err) => reject(err));
});

const joinCourse = ({ userId, courseId }) => new Promise((resolve, reject) => {
  Course.join(userId, courseId)
      .then(() => resolve({ status: 200, data: { message: 'Ok' } }))
      .catch((err) => reject(err));
});

const getAvailableLessons = ({ userId, courseId }) => new Promise((resolve, reject) => {
  Course.getAvailableLessons(userId, courseId)
      .then((data) => resolve({ status: 200, data }))
      .catch((err) => reject(err));
});

module.exports = {
  createCourse,
  deleteCourse,
  getCourse,
  joinCourse,
  getAvailableLessons,
};
