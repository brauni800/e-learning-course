'use strict';

const { Model } = require('objection');
const OptionModel = require('./option.model');
const QuestionModel = require('./question.model');

class AnswerModel extends Model {
  static get tableName() {
    return 'answer';
  }

  static get idColumn() {
    return ['answer_id', 'user_id', 'lesson_id', 'question_id'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        answer_id: { type: 'integer' },
        user_id: { type: 'integer' },
        lesson_id: { type: 'integer' },
        question_id: { type: 'integer' },
        answers: { type: 'string' },
        score: { type: 'number' },
      },
    };
  }

  /**
   * @param {{questionId:Number,optionIds:Number[]}} reply 
   * @returns {Promise<{questionId:Number,optionIds:Number[]}>}
   */
  static rate(reply) {
    return new Promise((resolve, reject) => {
      AnswerModel.transaction(async(trx) => {
        const question = await QuestionModel.query(trx).findById(reply.questionId).throwIfNotFound();
        const options = await OptionModel
            .query(trx)
            .join('question_option AS qo', 'option.option_id', '=', 'qo.option_id')
            .select('option.*', 'qo.answer')
            .where({ question_id: reply.questionId })
            .throwIfNotFound()
            .then((options) => options.filter((opt) => opt.answer));
        switch(question.type) {
          case 'multiple':
            const goodMultipleOptions = reply.optionIds.filter((id) => options.find((opt) => opt.option_id === id));
            const badMultipleOptions = reply.optionIds.filter((id) => !goodMultipleOptions.includes(id));
            console.log('multiple options', goodMultipleOptions, badMultipleOptions);
            reply.score = badMultipleOptions.length === 0 ? Number(((goodMultipleOptions.length * 10) / options.length).toFixed(2)) : 0;
            break;
          case 'full':
            const goodFullOptions = reply.optionIds.filter((id) => options.find((opt) => opt.option_id === id));
            const badFullOptions = reply.optionIds.filter((id) => !goodFullOptions.includes(id));
            reply.score = goodFullOptions.length === options.length && badFullOptions.length === 0 ? 10 : 0;
            break;
          case 'boolean':
          case 'one':
          default:
            reply.score = options.find((opt) => opt.option_id === reply.optionIds[0]) ? 10 : 0;
            break;
        }
        return reply;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  /**
   * @param {Number} userId 
   * @param {Number} lessonId 
   * @param {Array<{questionId:Number,optionIds:Number[]}>} replies 
   * @returns {Promise<AnswerModel[]>}
   */
  static reply(userId, lessonId, replies) {
    return new Promise((resolve, reject) => {
      AnswerModel.transaction(async(trx) => {
        const results = [];
        for (const reply of replies) {
          const answer = await AnswerModel
              .query(trx)
              .insert({
                user_id: userId,
                lesson_id: lessonId,
                question_id: reply.questionId,
                answers: JSON.stringify(reply.optionIds),
                score: reply.score,
              });
          results.push(answer);
        }
        return results;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  /**
   * @param {Number} userId 
   * @param {Number} lessonId 
   * @returns {Promise<AnswerModel[]>}
   */
  static getResults(userId, lessonId) {
    return new Promise((resolve, reject) => {
      AnswerModel
          .query()
          .where({
            user_id: userId,
            lesson_id: lessonId,
          })
          .throwIfNotFound()
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }
}

module.exports = AnswerModel;
