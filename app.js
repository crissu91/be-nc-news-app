const express = require('express');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors/error-handling')
const { getApi } = require('./controllers/api.controller')
const { getAllTopics } = require('./controllers/topics.controller');
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require('./controllers/comments.controller');
const { getArticlesById, getAllArticles, patchArticleById } = require('./controllers/articles.controller');
const { getAllUsers, postNewUser, getUserByUsername } = require('./controllers/users.controller');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getAllTopics);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.get('/api/articles', getAllArticles);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById );

app.get('/api/users', getAllUsers);

app.post('/api/users', postNewUser);

app.get('/api/users/:username', getUserByUsername)

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);


module.exports = app;