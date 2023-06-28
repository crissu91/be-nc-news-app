const { selectArticlesById, checkArticleIdExists } = require("../models/articles.models")


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