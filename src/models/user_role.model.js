'use strict';

const { Model } = require('objection');
const RoleModel = require('./role.model');

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

  static getUserRole(userId) {
    return new Promise((resolve, reject) => {
      UserRoleModel
        .query()
        .where({ user_id: userId })
        .then((record) => resolve(record))
        .catch((err) => reject(err));
    });
  }
};

module.exports = UserRoleModel;
