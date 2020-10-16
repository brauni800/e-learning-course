'use strict';

const { Model } = require('objection');
const AnswerModel = require('./answer.model');
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

  static deleteLessons(lessonId, correlative = false) {
    return new Promise((resolve, reject) => {
      LessonModel.transaction(async(trx) => {
        const deleteOneLesson = async(trx, lessonId) => {
          await CourseLessonModel
              .query(trx)
              .findOne({ lesson_id: lessonId })
              .delete();
          await LessonModel
              .query(trx)
              .where({ next_lesson: lessonId })
              .patch({ next_lesson: null });
          const lesson = await LessonModel
              .query(trx)
              .findById(lessonId);
          await lesson.$query(trx).delete();
          return lesson;
        }
        const results = [await deleteOneLesson(trx, lessonId)];
        if (correlative) {
          while (results[results.length - 1].next_lesson) {
            results.push(await deleteOneLesson(trx, results[results.length - 1].next_lesson));
          }
        }
        return results;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  /**
   * @param {Number} courseId
   * @returns {Promise<LessonModel[]>}
   */
  static getLessons(courseId) {
    return new Promise((resolve, reject) => {
      LessonModel
          .query()
          .join('course_lesson AS cl', 'lesson.lesson_id', '=', 'cl.lesson_id')
          .select('cl.course_id', 'lesson.*')
          .where({ course_id: courseId })
          .throwIfNotFound()
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  static getResults(userId, lessonId) {
    return new Promise((resolve, reject) => {
      AnswerModel.getResults(userId, lessonId)
          .then((answers) => answers.reduce((accumulator, current) => accumulator + Number(current.score), 0) / answers.length)
          .then((score) => LessonModel.query().findById(lessonId).then((lesson) => ({ lesson, score })))
          .then(({ lesson, score }) => ({
            userId,
            approved: score >= Number(lesson.approval),
            score,
          }))
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }
};

module.exports = LessonModel;
