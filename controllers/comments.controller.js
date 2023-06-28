const { checkArticleIdExists } = require("../models/articles.models");
const { selectAllCommentsByArticleId } = require("../models/comments.models")

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