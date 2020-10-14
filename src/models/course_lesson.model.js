'use strict';

const { Model } = require('objection');

class CourseLessonModel extends Model {
  static get tableName() {
    return 'course_lesson';
  }

  static get idColumn() {
    return ['course_id', 'lesson_id'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        course_id: { type: 'integer' },
        lesson_id: { type: 'integer' },
      },
    };
  }
};

module.exports = CourseLessonModel;
