
const { selectArticlesById, selectAllArticles, checkArticleIdExists, updateArticleByArticleId } = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

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
    const { sort_by, order, topic} = req.query;
    const articlesPromises = [selectAllArticles(sort_by, order, topic)]
    
    if (topic) {
        articlesPromises.push(checkTopicExists(topic))
    }
    Promise.all(articlesPromises)
    .then ((resolvedPromises)=>{
        const articles = resolvedPromises[0]
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    
    updateArticleByArticleId(inc_votes, article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch(next)
}