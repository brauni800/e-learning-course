'use strict';

const { Model } = require('objection');

class UserRoleModel extends Model {
  static get tableName() {
    return 'user_role';
  }

  static get idColumn() {
    return ['user_id', 'role_id'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        user_id: { type: 'integer' },
        role_id: { type: 'integer' },
      },
    };
  }
};

module.exports = UserRoleModel;
