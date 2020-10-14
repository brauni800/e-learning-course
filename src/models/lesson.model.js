'use strict';

const { Model } = require('objection');

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
};

module.exports = LessonModel;
