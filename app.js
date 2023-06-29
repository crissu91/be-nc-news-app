const express = require('express');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors/error-handling')
const { getApi } = require('./controllers/api.controller')
const { getAllTopics } = require('./controllers/topics.controller');
const { getArticlesById, getAllArticles } = require('./controllers/articles.controller');
const { getCommentsByArticleId, postCommentByArticleId } = require('./controllers/comments.controller');


const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getAllTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.get('/api/articles', getAllArticles);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);


module.exports = app;