'use strict';

const { Model } = require('objection');

class LessonQuestionModel extends Model {
  static get tableName() {
    return 'lesson_question';
  }

  static get idColumn() {
    return ['lesson_id', 'question_id'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        lesson_id: { type: 'integer' },
        question_id: { type: 'integer' },
      },
    };
  }
}

module.exports = LessonQuestionModel;
