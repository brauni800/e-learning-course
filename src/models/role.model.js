'use strict';

const { Model } = require('objection');

class RoleModel extends Model {
  static get tableName() {
    return 'role';
  }

  static get idColumn() {
    return 'role_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        role_id: { type: 'integer' },
        role: { type: 'string' },
      },
    };
  }

  static findByRole(role) {
    return new Promise((resolve, reject) => {
      RoleModel
          .query()
          .findOne({ role })
          .then((data) => resolve(data))
          .catch((err) => reject(err));
    });
  }
};

module.exports = RoleModel;
