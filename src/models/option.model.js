'use strict';

const { Model } = require('objection');

class OptionModel extends Model {
  static get tableName() {
    return 'option';
  }

  static get idColumn() {
    return 'option_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        option_id: { type: 'integer' },
        option: { type: 'string' },
      },
    };
  }
}

module.exports = OptionModel;
