'use strict';

const { Model } = require('objection');
const config = require('./config')[process.env.MODE];
const knex = require('knex')(config);

Model.knex(knex);
