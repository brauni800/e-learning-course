'use strict';

const router = require('express').Router();
const { validateToken } = require('../middlewares');
const UserResource = require('../domains/user/resource');
const CourseResource = require('../domains/course/resource');

router.use('/user', UserResource);
router.use('/course', validateToken, CourseResource);

module.exports = router;
