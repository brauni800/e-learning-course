'use strict';

const { Question } = require('../../../models');

const createQuestions = ({ lessonId, questions }) => new Promise((resolve, reject) => {
  Question.createQuestion(lessonId, questions)
      .then(() => resolve({ status: 200, data: { message: 'Ok' } }))
      .catch((err) => reject(err));
});

const deleteQuestions = ({ questionIds }) => new Promise((resolve, reject) => {
  Question.deleteQuestions(questionIds)
      .then(() => resolve({ status: 200, data: { message: 'Ok' } }))
      .catch((err) => reject(err));
});

module.exports = {
  createQuestions,
  deleteQuestions,
};
