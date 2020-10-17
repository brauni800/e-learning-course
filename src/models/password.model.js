'use strict';

const { genSaltSync, hashSync, compareSync } = require('bcrypt');

/**
 * [description]
 */
class PasswordModel {
  /**
   * @param {string} password [description]
   */
  constructor(password) {
    this.password = password;
    this.salt = genSaltSync(10);
  }

  /**
   * @returns {string} [description]
   */
  getHash() {
    return hashSync(this.password, this.salt);
  }

  /**
   * @param {string} password [description]
   * @param {string} hash [description]
   * @returns {Promise<String>} [description]
   */
  static compare(password, hash) {
    return new Promise((resolve, reject) => {
      const match = compareSync(password, hash);
      if (match) resolve(password);
      else reject(new Error('Invalid email or password'));
    });
  }
}

module.exports = PasswordModel;
