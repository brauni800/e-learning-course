'use strict';

const router = require('express').Router();
const { validateToken } = require('../middlewares');
const UserResource = require('../domains/user/resource');
const CourseResource = require('../domains/course/resource');
const LessonResource = require('../domains/lesson/resource');

router.use('/user', UserResource);
router.use('/course', validateToken, CourseResource);
router.use('/lesson', validateToken, LessonResource);

module.exports = router;
