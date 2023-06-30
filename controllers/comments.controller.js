const { checkArticleIdExists } = require("../models/articles.models");
const { selectAllCommentsByArticleId, insertCommentByArticleId, removeCommentById, checkCommentIdExists } = require("../models/comments.models");
const { checkIfUsernameExists } = require("../models/users.models");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const commentsPromise = [selectAllCommentsByArticleId(article_id)]

    if (article_id) {
        commentsPromise.push(checkArticleIdExists(article_id))
    }
    Promise.all(commentsPromise)
    .then((resolvedPromises)=>{
        const comments = resolvedPromises[0]
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username } = req.body;
    const postCommentPromise = []

    if (article_id) {
        postCommentPromise.push(checkArticleIdExists(article_id))
    }
    if (username) {
        postCommentPromise.push(checkIfUsernameExists(username))
    }
    Promise.all(postCommentPromise)
    .then((result) => {
        return insertCommentByArticleId(req.body, article_id)
    })
    .then((comment)=>{
        res.status(201).send({comment})
    })
    .catch(next)
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    removeCommentById(comment_id)     
    .then((response) => {
        res.sendStatus(204)
    })
    .catch(next)
}