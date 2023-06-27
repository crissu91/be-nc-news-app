const { selectArticlesById } = require("../models/articles.models");

exports.getArticlesById = (req, res, next) => {
    const { article_id} = req.params;
    return selectArticlesById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}