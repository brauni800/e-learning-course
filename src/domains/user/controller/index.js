'use strict';

const { User, Role, Password, Token } = require('../../../models');

const signup = (data, role = 'student') => new Promise((resolve, reject) => {
  Role.findByRole(role)
      .then((record) => User.createUser({
        ...data,
        roleId: record.role_id,
        password: new Password(data.password).getHash(),
      }))
      .then((record) => resolve({
        status: 200,
        data: { token: Token.generate({ userId: record.user_id }) },
      }))
      .catch((err) => reject(err));
});

const signin = ({ email, password }) => new Promise((resolve, reject) => {
  User.getUser(email)
      .then((record) => Password.compare(password, record.password).then(() => record))
      .then((record) => resolve({
        status: 200,
        data: { token: Token.generate({ userId: record.user_id }) },
      }))
      .catch((err) => reject(err));
});

module.exports = {
  signup,
  signin,
};
