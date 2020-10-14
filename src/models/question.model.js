'use strict';

const { Model } = require('objection');
const OptionModel = require('./option.model');
const LessonQuestionModel = require('./lesson_question.model');
const QuestionOptionModel = require('./question_option.model');

class QuestionModel extends Model {
  static get tableName() {
    return 'question';
  }

  static get idColumn() {
    return 'question_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        question_id: { type: 'integer' },
        question: { type: 'string' },
        type: { type: ['string', 'number'] },
      },
    };
  }
}

module.exports = QuestionModel;
