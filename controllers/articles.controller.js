
const { selectArticlesById, selectAllArticles, checkArticleIdExists, updateArticleByArticleId } = require("../models/articles.models");

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    const articlesPromises = [selectArticlesById(article_id)]

    if (article_id) {
        articlesPromises.push(checkArticleIdExists(article_id))
    }
    Promise.all(articlesPromises)
    .then ((resolvedPromises)=>{
        const articles = resolvedPromises[0]
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) =>{
    selectAllArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const articlePromises = []
    
    if (article_id) {
        articlePromises.push(checkArticleIdExists(article_id))
    }

    Promise.all(articlePromises)
    .then((resolvedPromises)=>{
        return updateArticleByArticleId(inc_votes, article_id)
    })
    .then((result)=>{
        const article = result[0]
        res.status(200).send({article})
    })
    .catch(next)
}