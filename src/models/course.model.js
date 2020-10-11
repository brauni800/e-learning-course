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
          console.log(index, courses[index], courses[index - 1]);
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
};

module.exports = CourseModel;
