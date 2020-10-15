'use strict';

const { Model } = require('objection');
const OptionModel = require('./option.model');
const LessonQuestionModel = require('./lesson_question.model');
const QuestionOptionModel = require('./question_option.model');

class QuestionModel extends Model {
  static get tableName() {
    return 'question';
  }

  static get idColumn() {
    return 'question_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        question_id: { type: 'integer' },
        question: { type: 'string' },
        type: { type: ['string', 'number'] },
      },
    };
  }

  static createQuestion(lessonId, questions) {
    return new Promise((resolve, reject) => {
      QuestionModel.transaction(async(trx) => {
        const result = [];
        for (const data of questions) {
          const question = await QuestionModel
              .query(trx)
              .insert({
                question: data.question,
                type: data.type || 'one',
              });
          await LessonQuestionModel
              .query(trx)
              .insert({
                lesson_id: lessonId,
                question_id: question.question_id,
              });
          if (question.type !== 'boolean') {
            const answers = data.options.filter((opt) => opt.answer);
            if (answers.length === 0) throw new Error('Questions must have at least one option with answer true parameter');
            if (question.type === 'one' && answers.length > 1) throw new Error('Type \'one\' question must have only one question with answer true parameter');
            question.options = [];
            for (const optionData of data.options) {
              const option = await OptionModel
                  .query(trx)
                  .insert({ option: optionData.option });
              await QuestionOptionModel
                  .query(trx)
                  .insert({
                    question_id: question.question_id,
                    option_id: option.option_id,
                    answer: optionData.answer || false,
                  });
              question.options.push(option);
            }
          } else {
            const option = await OptionModel
                .query(trx)
                .insert({ option: data.answer ? '1' : '0' });
            await QuestionOptionModel
                .query(trx)
                .insert({
                  question_id: question.question_id,
                  option_id: option.option_id,
                  answer: true,
                });
          }
          result.push(question);
        }
        return result;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }

  static deleteQuestions(questionIds) {
    return new Promise((resolve, reject) => {
      QuestionModel.transaction(async(trx) => {
        for (const questionId of questionIds) {
          const question = await QuestionModel
              .query(trx)
              .findById(questionId)
              .throwIfNotFound();
          await LessonQuestionModel
              .query(trx)
              .findOne({ question_id: question.question_id })
              .delete();
          const questionOptions = await QuestionOptionModel
              .query(trx)
              .where({ question_id: question.question_id })
              .throwIfNotFound();
          for (const questionOption of questionOptions) {
            await questionOption.$query(trx).delete();
            await OptionModel.query(trx).deleteById(questionOption.option_id);
          }
          await question.$query(trx).delete();
        }
        return { message: 'OK' };
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));;
    });
  }

  static getQuestionsByLessonId(lessonId) {
    return new Promise((resolve, reject) => {
      QuestionModel.transaction(async(trx) => {
        const questions = await QuestionModel
            .query(trx)
            .join('lesson_question AS lc', 'question.question_id', '=', 'lc.question_id')
            .select('lc.lesson_id', 'question.*')
            .where({ lesson_id: lessonId })
            .throwIfNotFound();
        for (const question of questions) {
          const options = await OptionModel
              .query(trx)
              .join('question_option AS qo', 'option.option_id', '=', 'qo.option_id')
              .select('option.*')
              .where({ question_id: question.question_id })
              .throwIfNotFound();
          question.options = [...options];
        }
        return questions;
      })
          .then((record) => resolve(record))
          .catch((err) => reject(err));
    });
  }
}

module.exports = QuestionModel;
