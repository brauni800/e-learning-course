'use strict';

const { Model } = require('objection');
const CourseLessonModel = require('./course_lesson.model');

class LessonModel extends Model {
  static get tableName() {
    return 'lesson';
  }

  static get idColumn() {
    return 'lesson_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        lesson_id: { type: 'integer' },
        approval: { type: 'number' },
        title: { type: 'string' },
        next_lesson: { type: ['integer', 'null'] },
      },
    };
  }

  static createLessons(courseId, lessons) {
    return new Promise((resolve, reject) => {
      LessonModel.transaction(async(trx) => {
        const results = [];
        for (let index in lessons) {
          index = Number(index);
          const lesson = await LessonModel
              .query(trx)
              .insert({
                approval: lessons[index].approval,
                title: lessons[index].title,
                next_lesson: null,
              });
          await CourseLessonModel
              .query(trx)
              .insert({
                course_id: courseId,
                lesson_id: lesson.lesson_id,
              });
          const previous = lessons[index - 1];
          if (previous) {
            const previousLesson = results.find((pl) => pl.title === previous.title);
            await previousLesson
                .$query(trx)
                .patch({ next_lesson: lesson.lesson_id });
          }
          results.push(lesson);
        }
        return results;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  static deleteLessons() {
    return new Promise((resolve, reject) => {});
  }

  static getLessons() {
    return new Promise((resolve, reject) => {});
  }
};

module.exports = LessonModel;
