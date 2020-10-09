'use strict';

const jwt = require('jsonwebtoken');

class TokenModel {
  static generate(data = {}) {
    return jwt.sign({ ...data }, process.env.TOKEN_SECRET);
  }
}

module.exports = TokenModel;
