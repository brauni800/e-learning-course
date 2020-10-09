'use strict';

require('dotenv').config();
require('./src/config/database');
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./src/routes');

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
    methods: [
      'GET', 'POST', 'PUT', 'DELETE', 'PATCH',
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(router);

const port = process.argv.slice(2)[0];
app.listen(port, () => {
  console.log(`Listen in port ${port}`);
});
