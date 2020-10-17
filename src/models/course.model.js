'use strict';

const { Model } = require('objection');
const LessonModel = require('./lesson.model');
const UserCourseModel = require('./user_course.model');

class CourseModel extends Model {
  static get tableName() {
    return 'course';
  }

  static get idColumn() {
    return 'course_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        course_id: { type: 'integer' },
        name: { type: 'string' },
        next_course: { type: ['integer', 'null'] },
      },
    };
  }

  static createCourses(userId, courses) {
    return new Promise((resolve, reject) => {
      CourseModel.transaction(async(trx) => {
        const results = [];
        for (let index in courses) {
          index = Number(index);
          const course = await CourseModel
              .query(trx)
              .insert({
                name: courses[index].name,
                next_course: null,
              });
          await UserCourseModel
              .query(trx)
              .insert({
                user_id: userId,
                course_id: course.course_id,
              });
          const previous = courses[index - 1];
          if (previous) {
            const previousCourse = results.find((pc) => pc.name === previous.name);
            await previousCourse
                .$query(trx)
                .patch({ next_course: course.course_id });
          }
          results.push(course);
        }
        return results;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  static deleteCourses(courseId, correlative = false) {
    return new Promise((resolve, reject) => {
      CourseModel.transaction(async(trx) => {
        const deleteOneCourse = async(trx, courseId) => {
          await UserCourseModel
              .query(trx)
              .findOne({ course_id: courseId })
              .delete();
          await CourseModel
              .query(trx)
              .where({ next_course: courseId })
              .patch({ next_course: null });
          const course = await CourseModel
              .query(trx)
              .findById(courseId);
          await course.$query(trx).delete();
          return course;
        }
        const results = [await deleteOneCourse(trx, courseId)];
        if (correlative) {
          while (results[results.length - 1].next_course) {
            results.push(await deleteOneCourse(trx, results[results.length - 1].next_course));
          }
        }
        return results;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  /**
   * @returns {Promise<CourseModel[]>}
   */
  static getCourses() {
    return new Promise((resolve, reject) => {
      CourseModel
          .query()
          .throwIfNotFound()
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  /**
   * @param {Number} userId 
   * @param {Number} courseId 
   * @returns {Promise<UserCourseModel>}
   */
  static join(userId, courseId) {
    return new Promise((resolve, reject) => {
      CourseModel.transaction(async(trx) => {
        await CourseModel.query(trx).findById(courseId).throwIfNotFound();
        const userCourse = await UserCourseModel
            .query(trx)
            .findOne({
              user_id: userId,
              course_id: courseId,
            });
        if (userCourse) throw new Error('You are already in this course');
        return await UserCourseModel
            .query(trx)
            .insert({
              user_id: userId,
              course_id: courseId,
            });
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  static getAvailableLessons(userId, courseId) {
    return new Promise((resolve, reject) => {
      CourseModel.transaction(async(trx) => {
        const userCourse = await UserCourseModel.query(trx).findOne({ user_id: userId, course_id: courseId });
        if (!userCourse) throw new Error('You are not in this course');
        const lessons = await LessonModel.getLessons(courseId);
        const firstLessonsInGroups = lessons.reduce((/** @type {LessonModel[]} */accumulator, /** @type {LessonModel} */ current, index, array) => {
          if (array.filter((dbl) => current.lesson_id === dbl.next_lesson).length === 0) accumulator.push(current);
          return accumulator;
        }, []);
        console.log(firstLessonsInGroups);
        return firstLessonsInGroups;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  static getStatus(userId, courseId) {
    return new Promise((resolve, reject) => {
      CourseModel.transaction(async(trx) => {
        const userCourse = await UserCourseModel.query(trx).findOne({ user_id: userId, course_id: courseId });
        if (!userCourse) throw new Error('You are not in this course');
        const course = await CourseModel.query(trx).findById(courseId).throwIfNotFound();
        const lessons = await LessonModel.getLessons(course.course_id);
        let scores = 0;
        for (const lesson of lessons) {
          lesson.results = await LessonModel.getResults(userId, lesson.lesson_id);
          lesson.results.score = Number(lesson.results.score);
          if (isNaN(lesson.results.score)) lesson.results.score = 'Still without taking the lesson';
          scores += !isNaN(lesson.results.score) ? lesson.results.score : 0;
        }
        return {
          userId,
          courseId,
          average: Number((scores / lessons.length).toFixed(2)),
          results: lessons.map((lesson) => ({ ...lesson.results, lessonId: lesson.lesson_id })),
        };
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }
};

module.exports = CourseModel;
