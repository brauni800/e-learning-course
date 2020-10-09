'use strict';

const router = require('express').Router();
const UserResource = require('../domains/user/resource');

router.use('/user', UserResource);

module.exports = router;
