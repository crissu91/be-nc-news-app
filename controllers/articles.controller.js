const { selectArticlesById, selectAllArticles } = require("../models/articles.models");

exports.getArticlesById = (req, res, next) => {
    const { article_id} = req.params;
    return selectArticlesById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) =>{
    selectAllArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}