'use strict';

const { Model } = require('objection');
const UserRoleModel = require('./user_role.model');


class UserModel extends Model {
  static get tableName() {
    return 'user';
  }

  static get idColumn() {
    return 'user_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        user_id: { type: 'integer' },
        email: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' },
      },
    };
  }

  static createUser({ email, password, name, roleId }) {
    return new Promise((resolve, reject) => {
      UserModel.transaction(async(trx) => {
        const user = await UserModel
            .query(trx)
            .insert({
              email,
              password,
              name,
            });
        const userRole = await UserRoleModel
              .query(trx)
              .insert({
                user_id: user.user_id,
                role_id: roleId,
              });
        return { ...user, ...userRole };
      })
          .then((data) => resolve(data))
          .catch((err) => reject(err));
    });
  }

  /**
   * @param {String} email 
   * @returns {Promise<UserModel>}
   */
  static getUser(email) {
    return new Promise((resolve, reject) => {
      UserModel
          .query()
          .findOne({ email })
          .throwIfNotFound()
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }
};

module.exports = UserModel;
