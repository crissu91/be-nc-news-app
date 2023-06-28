const db = require('../db/connection');

exports.selectArticlesById = (article_id) =>{
    return db.query("SELECT * FROM articles WHERE article_id = $1",[article_id]).then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article not found."})
        }
        else return rows
        })
}

exports.selectAllArticles = () => {
    const comments = db.query("SELECT * FROM comments;").then(({rows})=> rows)
    const articles = db.query("SELECT * FROM articles ORDER BY created_at DESC;").then(({rows})=> rows)
    
    return Promise.all([comments, articles]).then(([commentsResponse, articlesResponse]) => {
            return articlesResponse.map(
                ({ article_id, title, topic, author, created_at, votes, article_img_url }) => ({
                article_id,
                title,
                topic,
                author,
                created_at,
                votes,
                article_img_url,
                comment_count: commentsResponse.filter(
                    (comment) => comment.article_id === article_id
                ).length
                })
            )
        }
    )
}
