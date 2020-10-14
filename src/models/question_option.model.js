'use strict';

const { Model } = require('objection');

class QuestionOptionModel extends Model {
  static get tableName() {
    return 'question_option';
  }

  static get idColumn() {
    return ['question_id', 'option_id'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        question_id: { type: 'integer' },
        option_id: { type: 'integer' },
        answer: { type: 'boolean' },
      },
    };
  }
}

module.exports = QuestionOptionModel;
