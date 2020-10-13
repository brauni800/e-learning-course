'use strict';

const { Model } = require('objection');
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
};

module.exports = CourseModel;
