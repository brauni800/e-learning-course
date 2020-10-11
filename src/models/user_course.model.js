'use strict';

const { Model } = require('objection');

class UserCourseModel extends Model {
  static get tableName() {
    return 'user_course';
  }

  static get idColumn() {
    return ['user_id', 'course_id'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        user_id: { type: 'integer' },
        course_id: { type: 'integer' },
      },
    };
  }
};

module.exports = UserCourseModel;
