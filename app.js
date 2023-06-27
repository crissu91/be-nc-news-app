const express = require('express');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('../be-nc-news/errors/error-handling')
const { getApi } = require('./controllers/api.controller')
const { getAllTopics } = require('./controllers/topics.controller');

const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getAllTopics);

app.use(handlePsqlErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);


module.exports = app;