'use strict';

const { Token } = require('../models');
module.exports = (req, res, next) => {
  try {
    let token = req.get('Authorization');
    if (typeof token === 'string' && /Bearer\s/.test(token)) {
      token = token.replace('Bearer ', '');
      req.appended = Token.verify(token);
      next();
    } else throw new Error('Missing Bearer token');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
