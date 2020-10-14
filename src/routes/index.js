'use strict';

const router = require('express').Router();
const { validateToken } = require('../middlewares');
const UserResource = require('../domains/user/resource');
const CourseResource = require('../domains/course/resource');
const LessonResource = require('../domains/lesson/resource');
const QuestionResource = require('../domains/question/resource');

router.use('/user', UserResource);
router.use('/course', validateToken, CourseResource);
router.use('/lesson', validateToken, LessonResource);
router.use('/question', validateToken, QuestionResource);

module.exports = router;
