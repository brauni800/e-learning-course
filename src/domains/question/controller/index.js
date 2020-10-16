'use strict';

const { Question, Answer } = require('../../../models');

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

const getQuestions = ({ lessonId }) => new Promise((resolve, reject) => {
  Question.getQuestionsByLessonId(lessonId)
      .then((data) => resolve({ status: 200, data }))
      .catch((err) => reject(err));
});

const replyQuestion = ({ userId, lessonId, replies }) => new Promise((resolve, reject) => {
  Question.getQuestionsByLessonId(lessonId)
      .then(async(questions) => {
        if (replies.length !== questions.length) throw new Error('Missing or excess answers for this lesson');
        for (let reply of replies) {
          if (questions.find((q) => q.question_id === reply.questionId)) reply = await Answer.rate(reply);
          else throw new Error('Missing or excess answers for this lesson');
        }
        return replies;
      })
      .then((repliesRated) => Answer.reply(userId, lessonId, repliesRated))
      .then((record) => resolve({ status: 200, data: record }))
      .catch((err) => reject(err));
});

module.exports = {
  createQuestions,
  deleteQuestions,
  getQuestions,
  replyQuestion,
};
